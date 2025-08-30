import { Request, Response } from 'express';
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

const getContents = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw ApiError.badRequest('User must be logged in while getting the content');
  }

  const response = await Content.find({ userId: user.id });

  ApiResponse.sendResponse(res, ApiResponse.ok(response, 'Content fetched successfully'));
});

export { addContent, getContents };
