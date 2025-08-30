import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Content } from '../models/content.model';
import { addContentSchema } from '../types/content.types';
import ApiError from '../utils/API_ERROR';
import ApiResponse from '../utils/API_RESPONSE';
import asyncHandler from '../utils/asyncHandler';

const addContent = asyncHandler(async (req: Request, res: Response) => {
  const { link, contentType, title }: addContentSchema = req.body;

  if (!link || !link.trim() || !contentType || !contentType.trim() || !title || !title.trim()) {
    throw ApiError.badRequest('All fields should be provided while creating a content');
  }

  const user = req.user;

  if (!user) {
    throw ApiError.badRequest('User must be logged in while creating a content');
  }

  const response = await Content.create({
    link,
    contentType,
    tags: [],
    title,
    userId: user.id,
  });

  if (!response) {
    throw ApiError.internal('Failed to create content.');
  }

  ApiResponse.sendResponse(res, ApiResponse.ok(response, 'Content created successfully'));
});

const getAllContents = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw ApiError.badRequest('User must be logged in while getting the content');
  }

  const response = await Content.find({ userId: user.id }).populate('userId', 'username');

  ApiResponse.sendResponse(res, ApiResponse.ok(response, 'Content fetched successfully'));
});

const deleteContent = asyncHandler(async (req: Request, res: Response) => {
  const { contentId }: { contentId: string } = req.body;

  if (!contentId || !contentId.trim()) {
    throw ApiError.badRequest('Content id should be provided while deleting the content.');
  }

  const user = req.user;

  if (!user) {
    throw ApiError.badRequest('User must be logged in.');
  }

  const response = await Content.deleteOne({
    userId: user.id,
    _id: contentId,
  });

  if (response.deletedCount === 0) {
    throw ApiError.badRequest(
      'Content not found or you do not have permission to delete this content.',
    );
  }

  return ApiResponse.sendResponse(res, ApiResponse.ok(response, 'Content deleted successfully'));
});

const getContentWithId = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params?.id;

  if (!id || !id.trim() || !mongoose.isValidObjectId(id)) {
    throw ApiError.badRequest('Content id should be in proper format');
  }

  const response = await Content.findById(id);

  if (!response) {
    throw ApiError.badRequest('No content fetched with this id');
  }

  return ApiResponse.sendResponse(res, ApiResponse.ok(response, 'Content fetched successfully'));
});

export { addContent, deleteContent, getAllContents, getContentWithId };
