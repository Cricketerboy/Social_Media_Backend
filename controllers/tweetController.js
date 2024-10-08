import { Tweet } from "../models/tweetSchema.js";

export const createTweet = async (req,res) => {
    try {
    const {description, id} = req.body;
    if(!description || !id) {
        return  res.status(401).json({
            message: "Fields are required",
            success: false,
        });
    }
    await Tweet.create({
        description,
        userId: id,
    });
    return res.status(201).json({
        message: "Tweet created successfuly",
        success: true,
    })
    }
    catch(err) {
        console.log(err);
    }
}

export const deleteTweet = async(req,res) => {
    try {
       const {id} =  req.params;
       await Tweet.findByIdAndDelete(id);
       return res.status(201).json({
        message: "Tweet deleted successfully",
        success: true
       })
    }
    catch(err) {
        console.log(err);
    }
}

export const likeOrDislike = async(req,res) => {
    try{
       const loggedInUserId = req.body.id;
       const tweetId = req.params.id;
       const tweet = await Tweet.findById(tweetId);
       if(tweet.like.includes(loggedInUserId)) {
        //dislike
        await Tweet.findByIdAndUpdate(tweetId, {$pull:{like:loggedInUserId}});
        return res.status(201).json({
            message: "User disliked your tweet",
            success: true,
        })
       }
       else {
        await Tweet.findByIdAndUpdate(tweetId, {$push:{like:loggedInUserId}});
        return res.status(201).json({
            message: "User liked your tweet",
            success: true,
        })
       }
    }
    catch(err) {
        console.log(err);
    }
}

export const getAllTweets = async (req,res) => {
    try {
      const id = req.params.id;
      const loggedInUser = await User.indById(id);
      const loggedInUseTweets = await Tweet.find({userId:id});
      const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId) => {
        return Tweet.find({userId: otherUsersId});
      }));
      return res.status(200).json({
        tweet: loggedInUseTweets.concat(...followingUserTweet)
      })
    }
    catch(err) {
        console.log(err);
    }
}


export const getFollowingTweets = async(req,res) => {
    try {
        const id = req.params.id;
        const loggedInUser = await User.indById(id);
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId) => {
          return Tweet.find({userId: otherUsersId});
        }));
        return res.status(200).json({
          tweet: [].concat(...followingUserTweet)
        })
      }
      catch(err) {
          console.log(err);
      }
}