<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Models\BusinessCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BusinessCategoryController extends BaseController
{
    /**
     * Display a listing of active business categories.
     */
    public function index(): JsonResponse
    {
        try {
            $categories = BusinessCategory::active()
                ->ordered()
                ->get(['id', 'name', 'slug', 'description']);

            return $this->successResponse($categories, 'Business categories retrieved successfully');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve business categories: ' . $e->getMessage());
        }
    }

    /**
     * Store a newly created business category or get existing one.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            DB::beginTransaction();

            // Use getOrCreate to either find existing or create new
            $category = BusinessCategory::getOrCreate($request->name);
            
            // Update description if provided and category was just created
            if ($request->description && $category->wasRecentlyCreated) {
                $category->update(['description' => $request->description]);
            }

            DB::commit();

            $message = $category->wasRecentlyCreated 
                ? 'Business category created successfully' 
                : 'Business category already exists';

            return $this->successResponse(
                $category->only(['id', 'name', 'slug', 'description']), 
                $message,
                $category->wasRecentlyCreated ? 201 : 200
            );

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Failed to create business category: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified business category.
     */
    public function show(BusinessCategory $businessCategory): JsonResponse
    {
        try {
            return $this->successResponse(
                $businessCategory->only(['id', 'name', 'slug', 'description']),
                'Business category retrieved successfully'
            );

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve business category: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified business category.
     */
    public function update(Request $request, BusinessCategory $businessCategory): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            DB::beginTransaction();

            $businessCategory->update($validator->validated());

            DB::commit();

            return $this->successResponse(
                $businessCategory->only(['id', 'name', 'slug', 'description']),
                'Business category updated successfully'
            );

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Failed to update business category: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified business category.
     */
    public function destroy(BusinessCategory $businessCategory): JsonResponse
    {
        try {
            DB::beginTransaction();

            $businessCategory->delete();

            DB::commit();

            return $this->successResponse(null, 'Business category deleted successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Failed to delete business category: ' . $e->getMessage());
        }
    }
}
