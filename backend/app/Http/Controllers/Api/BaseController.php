<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;

class BaseController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Success response with data.
     */
    protected function successResponse($data = null, string $message = 'Success', int $status = 200): JsonResponse
    {
        $response = [
            'data' => $data,
            'meta' => [
                'message' => $message,
                'status' => 'success',
            ],
        ];

        return response()->json($response, $status);
    }

    /**
     * Success response with pagination.
     */
    protected function paginatedResponse(LengthAwarePaginator $paginator, string $message = 'Data retrieved successfully'): JsonResponse
    {
        $response = [
            'data' => $paginator->items(),
            'meta' => [
                'message' => $message,
                'status' => 'success',
                'pagination' => [
                    'current_page' => $paginator->currentPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'last_page' => $paginator->lastPage(),
                    'from' => $paginator->firstItem(),
                    'to' => $paginator->lastItem(),
                    'has_more_pages' => $paginator->hasMorePages(),
                ],
            ],
        ];

        return response()->json($response, 200);
    }

    /**
     * Error response.
     */
    protected function errorResponse(string $message = 'Error occurred', int $status = 400, $errors = null): JsonResponse
    {
        $response = [
            'data' => null,
            'meta' => [
                'message' => $message,
                'status' => 'error',
            ],
        ];

        if ($errors) {
            $response['meta']['errors'] = $errors;
        }

        return response()->json($response, $status);
    }

    /**
     * Created response.
     */
    protected function createdResponse($data = null, string $message = 'Resource created successfully'): JsonResponse
    {
        return $this->successResponse($data, $message, 201);
    }

    /**
     * No content response.
     */
    protected function noContentResponse(string $message = 'Resource deleted successfully'): JsonResponse
    {
        return $this->successResponse(null, $message, 204);
    }

    /**
     * Not found response.
     */
    protected function notFoundResponse(string $message = 'Resource not found'): JsonResponse
    {
        return $this->errorResponse($message, 404);
    }

    /**
     * Validation error response.
     */
    protected function validationErrorResponse($errors, string $message = 'Validation failed'): JsonResponse
    {
        return $this->errorResponse($message, 422, $errors);
    }

    /**
     * Unauthorized response.
     */
    protected function unauthorizedResponse(string $message = 'Unauthorized'): JsonResponse
    {
        return $this->errorResponse($message, 401);
    }

    /**
     * Forbidden response.
     */
    protected function forbiddenResponse(string $message = 'Forbidden'): JsonResponse
    {
        return $this->errorResponse($message, 403);
    }

    /**
     * Server error response.
     */
    protected function serverErrorResponse(string $message = 'Internal server error'): JsonResponse
    {
        return $this->errorResponse($message, 500);
    }

    /**
     * Bad request response.
     */
    protected function badRequestResponse(string $message = 'Bad request'): JsonResponse
    {
        return $this->errorResponse($message, 400);
    }

    /**
     * Apply filters to query.
     */
    protected function applyFilters($query, Request $request)
    {
        // Search filter
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_id', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($customerQuery) use ($search) {
                      $customerQuery->where('name', 'like', "%{$search}%")
                                   ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Status filter
        if ($request->has('filter.status') && !empty($request->get('filter.status'))) {
            $query->where('status', $request->get('filter.status'));
        }

        // Payment status filter
        if ($request->has('filter.payment_status') && !empty($request->get('filter.payment_status'))) {
            $query->where('payment_status', $request->get('filter.payment_status'));
        }

        // Payment method filter
        if ($request->has('filter.payment_method') && !empty($request->get('filter.payment_method'))) {
            $query->where('payment_method', $request->get('filter.payment_method'));
        }

        // Customer filter
        if ($request->has('filter.customer_id') && !empty($request->get('filter.customer_id'))) {
            $query->where('customer_id', $request->get('filter.customer_id'));
        }

        return $query;
    }

    /**
     * Apply sorting to query.
     */
    protected function applySorting($query, Request $request)
    {
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        // Validate sort order
        if (!in_array(strtolower($sortOrder), ['asc', 'desc'])) {
            $sortOrder = 'desc';
        }

        // Validate sort by field
        $allowedSortFields = ['created_at', 'updated_at', 'order_id', 'total', 'status', 'payment_status'];
        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'created_at';
        }

        return $query->orderBy($sortBy, $sortOrder);
    }

    /**
     * Apply date range filter to query.
     */
    protected function applyDateRange($query, Request $request)
    {
        if ($request->has('from') && !empty($request->from)) {
            $query->whereDate('created_at', '>=', $request->from);
        }

        if ($request->has('to') && !empty($request->to)) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        return $query;
    }
}
