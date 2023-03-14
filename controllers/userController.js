const multer = require("multer");
const path = require("path");
const fs = require("fs");
const validator = require("validator");
const People = require("../models/peopleModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

// Middlewares

const createUploadedImageURL = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  req.imgURL = url + "/avatar/" + req.file.filename;
  next();
};

const deleteUploadedImageIfUserExist = async (req, res, next) => {
  const isExist = await People.findOne({ email: req.body.email });
  if (isExist) {
    fs.unlink("${__dirname}/../avatar/" + req.file.filename, (err) => {});
  }
  next();
};

const deleteUploadedImageIfAdminDeleteTheUser = async (req, res, next) => {
  const user = await People.findById(req.params.id);

  if (!user) {
    return next(new AppError("No tour found with that ID", 404));
  }

  const userImageUrl = user.imgURL;
  const url = req.protocol + "://" + req.get("host");

  const path = userImageUrl.replace(url, "");

  fs.unlink(`${__dirname}/..${path}`, (err) => {});

  next();
};

// ***********Image Upload
const UPLOAD_FOLDER = `${__dirname}/../avatar/`;
//   Storage Define
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOAD_FOLDER);
  },
  filename(req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLocaleLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();
    cb(null, fileName + fileExt);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    if (["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("Image Upload fail", 403));
    }
  },
});

// Handlers
const getAllUsers = catchAsync(async (req, res) => {
  const users = await People.find();
  res.status(200).send({
    status: "success",
    data: {
      users,
    },
  });
});

const postAUser = catchAsync(async (req, res, next) => {
  const { name, email, mobile, password } = req.body;

  const newUser = await People.create({
    name,
    email,
    mobile,
    password,
    imgURL: req.imgURL,
  });
  res.status(201).send({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

const deleteAUser = catchAsync(async (req, res, next) => {
  const user = await People.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(200).send({
    status: "success",
    message: "Successfully Deleted",
  });
});

module.exports = {
  getAllUsers,
  postAUser,
  deleteAUser,
  upload,
  createUploadedImageURL,
  deleteUploadedImageIfUserExist,
  deleteUploadedImageIfAdminDeleteTheUser,
};
