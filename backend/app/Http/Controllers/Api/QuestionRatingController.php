<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\QuestionRatingRequest;
use App\Models\QuestionRating;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class QuestionRatingController extends Controller
{
    /**
     * Display a listing of questions and ratings.
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $query = QuestionRating::with(['user', 'product', 'store']);

        // Filter by store if user is store owner
        if ($user->role === 'store_owner') {
            $userStoreIds = Store::where('owner_id', $user->id)->pluck('id');
            $query->whereIn('store_id', $userStoreIds);
        }

        // Filter by type (question, rating, store-rating, product-rating, shipping-rating, blog)
        if ($request->has('type') && in_array($request->type, ['question', 'rating', 'store-rating', 'product-rating', 'shipping-rating', 'blog'])) {
            $query->where('type', $request->type);
        }

        // Filter by status
        if ($request->has('status') && in_array($request->status, ['published', 'unpublished'])) {
            $query->where('status', $request->status);
        }

        // Filter by product
        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        // Filter by rating (star rating)
        if ($request->has('rating') && $request->rating !== '') {
            $query->where('rating', (int) $request->rating);
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Filter by reply status
        if ($request->has('has_reply')) {
            if ($request->has_reply) {
                $query->whereHas('replies');
            } else {
                $query->whereDoesntHave('replies');
            }
        }

        // Search by content
        if ($request->has('search')) {
            $query->where('content', 'like', '%' . $request->search . '%');
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $questionsRatings = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $questionsRatings->items(),
            'pagination' => [
                'current_page' => $questionsRatings->currentPage(),
                'last_page' => $questionsRatings->lastPage(),
                'per_page' => $questionsRatings->perPage(),
                'total' => $questionsRatings->total(),
            ]
        ]);
    }

    /**
     * Store a newly created question or rating.
     */
    public function store(QuestionRatingRequest $request): JsonResponse
    {

        $user = Auth::user();

        $questionRating = QuestionRating::create([
            'type' => $request->type,
            'content' => $request->content,
            'rating' => $request->type === 'rating' ? $request->rating : null,
            'user_id' => $user->id,
            'product_id' => $request->product_id,
            'store_id' => $request->store_id,
            'status' => 'published',
        ]);

        $questionRating->load(['user', 'product', 'store']);

        return response()->json([
            'success' => true,
            'message' => ucfirst($request->type) . ' created successfully',
            'data' => $questionRating
        ], 201);
    }

    /**
     * Display the specified question or rating.
     */
    public function show(QuestionRating $questionRating): JsonResponse
    {
        $user = Auth::user();

        // Check if user can view this question/rating
        if ($user->role === 'store_owner' && $questionRating->store->owner_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to view this item'
            ], 403);
        }

        $questionRating->load(['user', 'product', 'store']);

        return response()->json([
            'success' => true,
            'data' => $questionRating
        ]);
    }

    /**
     * Update the specified question or rating.
     */
    public function update(Request $request, QuestionRating $questionRating): JsonResponse
    {
        $user = Auth::user();

        // Check if user can update this question/rating
        if ($user->role === 'store_owner' && $questionRating->store->owner_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to update this item'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'sometimes|string|max:1000',
            'rating' => 'sometimes|integer|min:1|max:5',
            'status' => 'sometimes|in:published,unpublished',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = $request->only(['content', 'status']);
        
        if ($questionRating->type === 'rating' && $request->has('rating')) {
            $updateData['rating'] = $request->rating;
        }

        $questionRating->update($updateData);
        $questionRating->load(['user', 'product', 'store']);

        return response()->json([
            'success' => true,
            'message' => ucfirst($questionRating->type) . ' updated successfully',
            'data' => $questionRating
        ]);
    }

    /**
     * Remove the specified question or rating.
     */
    public function destroy(QuestionRating $questionRating): JsonResponse
    {
        $user = Auth::user();

        // Check if user can delete this question/rating
        if ($user->role === 'store_owner' && $questionRating->store->owner_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to delete this item'
            ], 403);
        }

        $questionRating->delete();

        return response()->json([
            'success' => true,
            'message' => ucfirst($questionRating->type) . ' deleted successfully'
        ]);
    }

    /**
     * Get statistics for questions and ratings.
     */
    public function statistics(Request $request): JsonResponse
    {
        $user = Auth::user();
        $query = QuestionRating::query();

        // Filter by store if user is store owner
        if ($user->role === 'store_owner') {
            $userStoreIds = Store::where('owner_id', $user->id)->pluck('id');
            $query->whereIn('store_id', $userStoreIds);
        }

        $totalQuestions = (clone $query)->where('type', 'question')->count();
        $totalRatings = (clone $query)->where('type', 'rating')->count();
        $publishedQuestions = (clone $query)->where('type', 'question')->where('status', 'published')->count();
        $publishedRatings = (clone $query)->where('type', 'rating')->where('status', 'published')->count();
        $unpublishedQuestions = (clone $query)->where('type', 'question')->where('status', 'unpublished')->count();
        $unpublishedRatings = (clone $query)->where('type', 'rating')->where('status', 'unpublished')->count();

        // Average rating
        $averageRating = (clone $query)->where('type', 'rating')->where('status', 'published')->avg('rating');

        // Recent activity (last 7 days)
        $recentQuestions = (clone $query)->where('type', 'question')
            ->where('created_at', '>=', now()->subDays(7))
            ->count();
        $recentRatings = (clone $query)->where('type', 'rating')
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_questions' => $totalQuestions,
                'total_ratings' => $totalRatings,
                'published_questions' => $publishedQuestions,
                'published_ratings' => $publishedRatings,
                'unpublished_questions' => $unpublishedQuestions,
                'unpublished_ratings' => $unpublishedRatings,
                'average_rating' => round($averageRating, 2),
                'recent_questions' => $recentQuestions,
                'recent_ratings' => $recentRatings,
            ]
        ]);
    }

    /**
     * Bulk update status of questions and ratings.
     */
    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:questions_ratings,id',
            'status' => 'required|in:published,unpublished',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        $query = QuestionRating::whereIn('id', $request->ids);

        // Filter by store if user is store owner
        if ($user->role === 'store_owner') {
            $userStoreIds = Store::where('owner_id', $user->id)->pluck('id');
            $query->whereIn('store_id', $userStoreIds);
        }

        $updated = $query->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => "Successfully updated {$updated} items",
            'updated_count' => $updated
        ]);
    }

    /**
     * Bulk delete questions and ratings.
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:questions_ratings,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        $query = QuestionRating::whereIn('id', $request->ids);

        // Filter by store if user is store owner
        if ($user->role === 'store_owner') {
            $userStoreIds = Store::where('owner_id', $user->id)->pluck('id');
            $query->whereIn('store_id', $userStoreIds);
        }

        $deleted = $query->delete();

        return response()->json([
            'success' => true,
            'message' => "Successfully deleted {$deleted} items",
            'deleted_count' => $deleted
        ]);
    }
}
