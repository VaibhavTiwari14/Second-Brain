import { Request, Response } from 'express';
import { Content } from '../models/content.model';
import { Link } from '../models/link.model';
import { User } from '../models/user.model';
import ApiError from '../utils/API_ERROR';
import ApiResponse from '../utils/API_RESPONSE';
import asyncHandler from '../utils/asyncHandler';

const shareLink = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  const { share }: { share: boolean | undefined } = req.body;

  if (!user) {
    throw ApiError.badRequest('User must be logged in.');
  }

  if (share === undefined) {
    throw ApiError.badRequest('Share parameter is required.');
  }

  if (share) {
    const existingLink = await Link.findOne({ userId: user.id });

    if (existingLink) {
      return ApiResponse.sendResponse(
        res,
        ApiResponse.ok(existingLink, 'Share link already exists'),
      );
    }

    const newLink = await Link.create({
      hash: random(10),
      userId: user.id,
    });

    return ApiResponse.sendResponse(
      res,
      ApiResponse.ok(newLink, 'Share link created successfully'),
    );
  } else {
    const result = await Link.deleteOne({ userId: user.id });

    if (result.deletedCount === 0) {
      throw ApiError.badRequest('No share link found to delete.');
    }

    return ApiResponse.sendResponse(res, ApiResponse.ok(result, 'Share link deleted successfully'));
  }
});

const getLink = asyncHandler(async (req: Request, res: Response) => {
  const hash = req.params.shareLink;

  if (!hash || !hash.trim()) {
    throw ApiError.badRequest('shareLink must be provided');
  }

  const link = await Link.findOne({ hash });

  if (!link) {
    throw ApiError.badRequest('Incorrect hash provided.');
  }

  const contentOwner = await User.findById(link.userId).select('username');

  if (!contentOwner) {
    throw ApiError.badRequest('Content owner not found.');
  }

  const content = await Content.find({ userId: link.userId });

  if (content.length === 0) {
    throw ApiError.badRequest('No content found for this user.');
  }

  return ApiResponse.sendResponse(
    res,
    ApiResponse.ok(
      {
        username: contentOwner.username,
        content,
      },
      'Shared content retrieved successfully',
    ),
  );
});

const random = (length: number) => {
  const options = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let ans = '';

  for (let i = 0; i < length; i++) {
    let index = Math.floor(Math.random() * options.length);
    ans += options[index === 62 ? 61 : index];
  }

  return ans;
};

export { shareLink , getLink};
