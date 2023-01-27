import responseHandler from "../handlers/response.handler.js";
import reviewModel from "../models/review.model.js";

const create = async (req, res) => {
  try {
    const { movieId } = req.params;
    const review = new reviewModel({
      ...req.body,
      user: req.user.id,
      movieId,
    });

    await review.save();
    responseHandler.created(res, {
      ...review._doc,
      id: review.id,
      user: req.user,
    });
  } catch {
    responseHandler.error(res);
  }
};

const remove = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await reviewModel.findOne({ user: req.user.id, reviewId });
    if (!review) return responseHandler.notFound(res);

    await review.remove();
    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getReviewOfUser = async (req, res) => {
  try {
    const review = await reviewModel
      .find({ user: req.user.id })
      .sort("-createdAt");
    if (!review) return responseHandler.notFound(res);

    responseHandler.ok(res, review);
  } catch (e) {
    console.log("Error in getReviewOfUser: ", e);
    responseHandler.error(res);
  }
};

export default { create, remove, getReviewOfUser };
