<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReplyRequest;
use App\Models\Reply;
use App\Models\QuestionRating;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ReplyController extends Controller
{
    /**
     * Display a listing of replies for a specific question/rating.
     */
    public function index(Request $request, int $questionRatingId): JsonResponse
    {
        $user = Auth::user();
        
        // Verify the question/rating exists and user has access
        $questionRating = QuestionRating::with(['store'])->findOrFail($questionRatingId);
        
        // Check if user is store owner and owns this store
        if ($user->role === 'store_owner' && $questionRating->store->owner_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $replies = Reply::with(['user'])
            ->where('question_rating_id', $questionRatingId)
            ->published()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $replies
        ]);
    }

    /**
     * Store a newly created reply.
     */
    public function store(ReplyRequest $request): JsonResponse
    {
        $user = Auth::user();
        
        // Verify the question/rating exists and user has access
        $questionRating = QuestionRating::with(['store'])->findOrFail($request->question_rating_id);
        
        // Check if user is store owner and owns this store
        if ($user->role === 'store_owner' && $questionRating->store->owner_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $reply = Reply::create([
            'content' => $request->content,
            'question_rating_id' => $request->question_rating_id,
            'user_id' => $user->id,
            'status' => $request->status ?? 'published',
        ]);

        $reply->load(['user']);

        return response()->json([
            'success' => true,
            'data' => $reply,
            'message' => 'Reply created successfully'
        ], 201);
    }

    /**
     * Display the specified reply.
     */
    public function show(int $id): JsonResponse
    {
        $user = Auth::user();
        $reply = Reply::with(['user', 'questionRating.store'])->findOrFail($id);
        
        // Check if user is store owner and owns this store
        if ($user->role === 'store_owner' && $user->store_id !== $reply->questionRating->store_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $reply
        ]);
    }

    /**
     * Update the specified reply.
     */
    public function update(ReplyRequest $request, int $id): JsonResponse
    {
        $user = Auth::user();
        $reply = Reply::with(['questionRating.store'])->findOrFail($id);
        
        // Check if user is store owner and owns this store
        if ($user->role === 'store_owner' && $user->store_id !== $reply->questionRating->store_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Check if user owns this reply
        if ($reply->user_id !== $user->id) {
            return response()->json(['error' => 'You can only edit your own replies'], 403);
        }

        $reply->update([
            'content' => $request->content,
            'status' => $request->status ?? $reply->status,
        ]);

        $reply->load(['user']);

        return response()->json([
            'success' => true,
            'data' => $reply,
            'message' => 'Reply updated successfully'
        ]);
    }

    /**
     * Remove the specified reply.
     */
    public function destroy(int $id): JsonResponse
    {
        $user = Auth::user();
        $reply = Reply::with(['questionRating.store'])->findOrFail($id);
        
        // Check if user is store owner and owns this store
        if ($user->role === 'store_owner' && $user->store_id !== $reply->questionRating->store_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Check if user owns this reply
        if ($reply->user_id !== $user->id) {
            return response()->json(['error' => 'You can only delete your own replies'], 403);
        }

        $reply->delete();

        return response()->json([
            'success' => true,
            'message' => 'Reply deleted successfully'
        ]);
    }
}
