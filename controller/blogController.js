const mongoose = require("mongoose");
const blogModel = require("../model/blogModel");
const userModel = require("../model/userModel");

exports.getAllBlogsController = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).populate("user");
    if (!blogs) {
      return res
        .status(200)
        .send({ success: false, message: "No blogs found" });
    }
    return res.status(200).send({
      success: true,
      BlogCount: blogs.length,
      message: "All Blogs Lists",
      blogs,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, message: "Error while getting Blogs", err });
  }
};

exports.createBlogController = async (req, res) => {
  try {
    const { title, description, image, user } = req.body;
    // validation
    if (!title || !description || !image || !user) {
      return res
        .status(400)
        .send({ success: false, message: "Please Provide All Fields" });
    }
    const existingUser = await userModel.findById(user);
    //validation
    if (!existingUser) {
      return res
        .status(404)
        .send({ success: false, message: "unable to find user" });
    }
    const newBlog = new blogModel({ title, description, image, user });
    const session = await mongoose.startSession();
    session.startTransaction();
    await newBlog.save({ session });
    existingUser.blogs.push(newBlog);
    await existingUser.save({ session });
    await session.commitTransaction();
    await newBlog.save();
    return res
      .status(201)
      .send({ success: true, message: "blogs created", newBlog });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send({ success: false, message: "Error while Creating Blog ", err });
  }
};

exports.updateBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;
    const blog = await blogModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res
      .status(200)
      .send({ success: true, message: "Blog updated", blog });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send({ success: false, message: "Error while upadating blog", err });
  }
};

exports.getBlogByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res
        .status(404)
        .send({ success: false, message: "blog not find with this id " });
    }
    return res
      .status(200)
      .send({ success: true, message: "fetch single blog", blog });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      success: false,
      message: "error while getting single blog",
      err,
    });
  }
};

exports.deleteBlogController = async (req, res) => {
  try {
    const blog = await blogModel
      .findByIdAndDelete(req.params.id)
      .populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
    return res.status(200).send({ success: true, message: "Blog Deleted!" });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      success: false,
      message: "error while deleting blog",
      err,
    });
  }
};

exports.userBlogController = async (req, res) => {
  try {
    const userBlog = await userModel.findById(req.params.id).populate("blogs");
    if (!userBlog) {
      return res
        .status(404)
        .send({ success: false, message: "blogs not found with this id" });
    }
    return res
      .status(200)
      .send({ success: true, message: "user blogs", userBlog });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send({ success: false, message: "error in user blog", err });
  }
};
