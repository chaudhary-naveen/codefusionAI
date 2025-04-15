import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import * as React from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Button from "@mui/material/Button";
import axios from "axios";
import path from "../../path";
import pathai from '../../pathai.js';
import { useEffect } from "react";
import AddCommentIcon from "@mui/icons-material/AddComment";
import ShareIcon from "@mui/icons-material/Share";
import CodeMirror from "@uiw/react-codemirror";
import { basicDark } from "@uiw/codemirror-theme-basic";
import { langs } from "@uiw/codemirror-extensions-langs";
import { EditorView } from "@uiw/react-codemirror";
import {
  MenuItem,
  Menu,
  Avatar,
  Tooltip,
  IconButton,
  Icon,
} from "@mui/material";
import BookmarkAddedRoundedIcon from "@mui/icons-material/BookmarkAddedRounded";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Brain, Pen, PencilSimpleLine, Tag, TextUnderline } from "phosphor-react";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import SendIcon from "@mui/icons-material/Send";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Dropdown } from "keep-react";
import { ChatTeardropDots, Book } from "phosphor-react";
import "react-toastify/dist/ReactToastify.css";
import {
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  List,
} from "@mui/material";
import Popup from "../common/popup";
// import { EditorView } from '@codemirror/view';

// Create a custom theme
const myTheme = EditorView.theme({
  '&': {
    color: 'white', // 🌊 Text color
    backgroundColor: 'black', // Optional: background
    fontSize: '16px',
  },
  '.cm-content': {
    caretColor: 'white', // Optional: cursor color
  },
  '.cm-scroller': {
    fontFamily: 'monospace', // or 'Poppins', 'Arial', etc.
  },
});


const CommentComponent = ({ data }) => {
  console.log(data);
  return (
    <>
      <div className="comment-component">
        <div className="comment-headline">{data.length} Comments</div>
        <div className="comment-list-container">
          <List>
            {data.map((cmmnt) => (
              <Link to={`/user/${cmmnt.user.username}`}>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar src={cmmnt.user.profilePicture}></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={cmmnt.user.firstname}
                    secondary={cmmnt.comment}
                  ></ListItemText>
                </ListItemButton>
              </Link>
            ))}
          </List>
        </div>
      </div>
    </>
  );
};

const AIComponent = ({ data }) => {
  console.log(data);
  return (
    <>
      <div className="comment-component">
        <div className="comment-headline">{data.length} Comments</div>
        <div className="comment-list-container">
          <List>
            {data.map((cmmnt) => (
              <Link to={`/user/${cmmnt.user.username}`}>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar src={cmmnt.user.profilePicture}></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={cmmnt.user.firstname}
                    secondary={cmmnt.comment}
                  ></ListItemText>
                </ListItemButton>
              </Link>
            ))}
          </List>
        </div>
      </div>
    </>
  );
};

const Post = (props) => {
  const id = props.id;
  const [data, setData] = useState(props.data);

  const [time, setTime] = React.useState("");
  const [chatAi, setChatAi] = useState(false);
  const user = useSelector((s) => s.user?.user);
  const UserDB = useSelector((s) => s.user?.userDB);
  const [savePostLoad, setSavePostLoad] = useState(false);
  const [postCreator, setPostCreator] = useState(data?.user);
  const [commentText, setCommentText] = useState("");
  const [AIinfo, setAIinfo] = useState("Hi, I am your AI assistant");
  const [AIThinking,setAIThinking] = useState(false);
  const [AIoutput, setAIoutput] = useState(false);
  const [postCode,setPostCode] = useState(props.data?.postCode);
  const [editable,setEditable] = useState(false);
  const [commentTextAI, setCommentTextAI] = useState("");
  const [commnentPopup, setCommentPopup] = useState(false);
  const [commentInputshow, setCommentInput] = React.useState(false);
  const [BOOK, setBOOK] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showMenu, setshowMenu] = useState(false);
  const [showQuestion, setshowQuestion] = useState(false);
  const menuRef = React.useRef();

  // const code = data ? data.postCode?.split(/\n/g) : "";
  useEffect(() => {
    if (data) {
      if (data?.likes?.includes(user._id)) {
        setLiked(true);
      }
    }
  }, [data]);

  React.useEffect(() => {
    const date2 = new Date(data?.createdAt);
    setTime(date2.toLocaleTimeString() + " " + date2.toLocaleDateString());

    // if(diffTime>14400){
    // }
    // else if(diffTime>31090){
    //   .log("1");
    //    setTime((diffTime/31090).toFixed() + " Hours Ago");
    // }
    // else if(diffTime>60){
    //   console.log("2");

    //    setTime(setTime((diffTime/60).toFixed() + " Mins Ago"));
    // }else{
    //   console.log("3");
    //   setTime(setTime((diffTime).toFixed() + " Seconds Ago"));
    // }
  }, []);

  const submitComment = async () => {
    if (commentText.length == 0) {
      return;
    }
    if (!user) {
      toast.info("Please Sigin First ");
      return;
    }

    try {
      const res = axios.post(`${path}comment`, {
        postid: data._id,
        user: {
          username: user.username,
          profilePicture: user.profilePicture,
          firstname: user.firstname,
          lastname: user.lastname,
          userId: user._id,
        },
        commentText,
      });

      setCommentText("");
      toast.promise(res, {
        success: "Comment Posted",
        pending: "posting Comment ...",
        error: "Comment can't posted ! Please Try again",
      });
      getPost();
    } catch (err) { }
  };


  const submitCommentAI = async () => {
    if (commentTextAI.length == 0) {
      return;
    }
    setAIinfo("");
    setAIThinking(true);
    try {
      const response = await axios.post(pathai, {
        code: props.data?.postCode,
        query: commentTextAI
      });
      setPostCode(response.data);
      setAIoutput(true);
    } catch (err) {
      console.log(err);
    }
    setAIinfo("Output Generated ! Feel free to ask something more...");
    setAIThinking(false);
  };

  const getPost = async () => {
    try {
      const res = await axios.post(`${path}getpost`, {
        postid: data._id,
      });

      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addLike = async () => {
    setLikeLoading(true);
    if (!user) {
      toast.info("Please Sigin/Login First to Vote UP");
      return;
    }
    const response = await axios.post(`${path}addlike`, {
      user: user._id,
      post: data._id,
    });

    if (response.data.success) {
      getPost();
    }
  };

  const getCreatorPost = async () => {
    try {
      const response = await axios.get(
        `${path}getUser?username=${postCreator.username}`
      );

      if (response.data.success) {
        setPostCreator(response.data.user);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const savePost = async () => {
    setSavePostLoad(true);
    try {
      const response = await axios.post(`${path}savepost`, {
        user: user._id,
        post: data._id,
      });
      console.log(response);
      setBOOK(true);
    } catch (err) { }
    setSavePostLoad(false);
  };

  const unsavepost = async () => {
    setSavePostLoad(true);
    try {
      const response = await axios.post(`${path}unsavepost`, {
        user: user._id,
        post: data._id,
      });
      console.log(response);
      if (response.data.success) {
        setBOOK(false);
      }
    } catch (err) { }
    setSavePostLoad(false);
  };

  React.useEffect(() => {
    getCreatorPost();

    UserDB?.savedpost?.forEach((ele) => {
      if (ele?._id == data?._id) {
        setBOOK(true);
      }
    });
  }, []);

  return (
    <div className="post">
      {commnentPopup ? (
        <Popup
          cancel={() => setCommentPopup(false)}
          heading={"Comments"}
          wid={"400px"}
          element={<CommentComponent data={data.comments}></CommentComponent>}
        ></Popup>
      ) : (
        ""
      )}

      <ToastContainer></ToastContainer>
      <div className="post-head">
        <Link to={"/user/" + postCreator?.username}>
          <Avatar src={postCreator?.profilePicture}></Avatar>
          <div className="post-head-details">
            <p>{data?.user?.firstname + " " + data?.user?.lastname}</p>
            <span>
              {" @" +
                postCreator?.username +
                " ||         " +
                postCreator?.designation}
            </span>
            <span>{time}</span>
          </div>
        </Link>

        <div>

          <div className="post-head-tools mx-1" onClick={() => {
            navigator?.clipboard?.writeText(
              window.location.host + "/post/" + data._id
            );
            toast.info("Link copied to Clipboard");
          }}>
            <ShareIcon size={24} weight="duotone"></ShareIcon>
          </div>

          <div
            className="post-head-tools"
            onClick={() => setshowMenu(!showMenu)}
          >
            <IconButton>
              <Tag size={24} weight="duotone"></Tag>
            </IconButton>
          </div>
          {data?.question && (
            <div
              className="post-head-tools mx-1"
              onClick={() => setshowQuestion(!showQuestion)}
            >
              <IconButton>
                <Book size={24} weight="duotone"></Book>
              </IconButton>
            </div>

          )}

          <div
            className="post-head-tools mx-1"
            onClick={() => setEditable(!editable)}
          >
            <IconButton style={editable? {backgroundColor:"green",color:"white"}:{}}>
              <PencilSimpleLine size={24} weight="duotone"></PencilSimpleLine>
            </IconButton>
          </div>


        </div>
      </div>
      {showQuestion && (
        <div className="post-label">
          <p>
            Question :{" "}
            <Link
              to={"/problems?question=" + data?.question.questionID}

            >
              <span>
                {data?.question?.title}
              </span>
            </Link>
          </p>
        </div>
      )}
      {showMenu && (
        <div className="post-label">
          {data?.label?.length == 0 && "No Labels"}
          {data?.label?.map((tag) => (
            <span>{tag}</span>
          ))}
        </div>
      )}

      <div className="post-body">
        <span>{data?.title}</span>
        <div>
          {/* {code.map((ele) => (
            <p>{ele}</p>
          ))} */}
          <CodeMirror
            value={postCode}
            onChange={(value) => setPostCode(value)}
            style={{ maxHeight: "600px" }}
            theme={basicDark}
            extensions={[langs.cpp(), EditorView.editable.of(editable), EditorView.lineWrapping]}
            readOnly={!editable}
          ></CodeMirror>
        </div>


      </div>
      <div className="post-lower">
        <div className="post-lower-count">
          <Tooltip>
            <p style={{ color: "#0b2239" }}>
              {data?.likes?.length + " "}
              <span>supports</span>
            </p>
          </Tooltip>
          <Tooltip title="see Comments">
            <p>
              {data?.comments?.length + " "}
              <span>comments</span>
            </p>
          </Tooltip>
        </div>
        <div className="post-lower-group">
          <div>
            {liked ? (
              <>
                <Button>
                  <IconButton
                    style={{
                      backgroundColor: "#004E64",
                    }}
                  >
                    <KeyboardDoubleArrowUpIcon
                      style={{
                        color: "white",
                      }}
                    ></KeyboardDoubleArrowUpIcon>
                  </IconButton>

                  {window.outerWidth > 1090 && "Voted"}
                </Button>
              </>
            ) : (
              <Button
                variant="text"
                disabled={likeLoading}
                onClick={addLike}
                sx={{ color: "gray" }}
              >
                <IconButton
                  style={{
                    backgroundColor: "#e4e6eb",
                  }}
                >
                  <KeyboardDoubleArrowUpIcon></KeyboardDoubleArrowUpIcon>
                </IconButton>
                {window.outerWidth > 1090 && "Vote"}
              </Button>
            )}
          </div>

          <div
            onClick={() => {
              setCommentInput((prev) => !prev);
              setChatAi(false);
            }}
          >
            <Tooltip title="add comment">
              <Button variant="text" sx={{ color: "gray" }}>
                <IconButton
                  style={{
                    backgroundColor: "#e4e6eb",
                  }}
                >
                  <ChatTeardropDots size={26} />
                  {/* <AddCommentIcon></AddCommentIcon> */}
                </IconButton>
                {window.outerWidth > 1090 && "Comments"}
              </Button>
            </Tooltip>
          </div>

          <div>
            {BOOK ? (
              <>
                <Button
                  variant="text"
                  style={{
                    color: "green",
                  }}
                  onClick={unsavepost}
                >
                  <IconButton
                    style={{
                      backgroundColor: "green",
                    }}
                  >
                    <BookmarkAddedRoundedIcon
                      style={{ color: "white" }}
                    ></BookmarkAddedRoundedIcon>
                  </IconButton>
                  {window.outerWidth > 1090 && "Saved"}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setSavePostLoad(true);
                  savePost();
                }}
                variant="text"
                disabled={savePostLoad}
                sx={{ color: "gray" }}
              >
                <IconButton
                  style={{
                    backgroundColor: "#e4e6eb",
                  }}
                >
                  <BookmarkBorderIcon></BookmarkBorderIcon>
                </IconButton>
                {window.outerWidth > 1090 && "Save"}
              </Button>
            )}
          </div>

          <div
            onClick={() => {
              setChatAi((prev) => !prev);
              setCommentInput(false);
            }}
          >
            <Tooltip title="Ask AI">
              <Button variant="text" sx={{ color: "gray" }}
              >
                <IconButton
                  style={
                    chatAi ? {
                      backgroundColor: "green",
                      color: "white"
                    } :
                      {
                        backgroundColor: "#e4e6eb",
                      }
                  }
                >
                  <Brain size={26} />
                </IconButton>
                {window.outerWidth > 1090 && (chatAi ? "Stop AI" : "Ask AI")}
              </Button>
            </Tooltip>
          </div>

        </div>
        {commentInputshow ? (
          <>
            {data?.comments?.length > 0 ? (
              <>
                <div className="comment-Box">
                  <div className="comment-Box-image">
                    <img
                      src={
                        data?.comments[data.comments.length - 1].user
                          .profilePicture
                      }
                    ></img>
                  </div>
                  <div>
                    <p>
                      {data?.comments[data.comments.length - 1].user.firstname}
                    </p>
                    <span>
                      {data?.comments[data.comments.length - 1].comment}
                    </span>
                  </div>
                </div>
                <a
                  style={{ padding: "10px" }}
                  onClick={() => setCommentPopup(true)}
                >
                  View all comments
                </a>
              </>
            ) : (
              ""
            )}
            <div className="comment-edit">
              <span>
                <Avatar src={UserDB?.profilePicture}></Avatar>
              </span>
              <input
                type="text"
                placeholder="Type here"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></input>
              <span onClick={submitComment}>
                <SendIcon sx={{ color: "#cdcfd0" }}></SendIcon>
              </span>
            </div>
          </>
        ) : (
          ""
        )}

        {chatAi ? (
          <>
            <>
              <div className={AIThinking ? "comment-Box flash-loader" : "comment-Box"}>
                <div className="comment-Box-image">
                  <Brain size={32}></Brain>
                </div>
                <div>
                  <p>
                    Meta Code Llama
                  </p>
                  
                  <span className={ AIThinking ? "flash-animation" : ""}>
                    {AIinfo}
                  </span>

                </div>
              </div>
              <a
                style={{ padding: "10px" }}
                className="pointer"
                onClick={() => {
                  setPostCode(props.data?.postCode);
                  setAIoutput(false);
                }}
              >
                Clear AI respone to original Post <span className="underline">Click here</span>
              </a>
            </>
            <div className="comment-edit">
              <span>
                <Avatar src={UserDB?.profilePicture}></Avatar>
              </span>
              <input
                type="text"
                placeholder="Ask your Queries to AI"
                value={commentTextAI}
                onChange={(e) => setCommentTextAI(e.target.value)}
              ></input>
              <span onClick={submitCommentAI}>
                <SendIcon sx={{ color: "#cdcfd0" }}></SendIcon>
              </span>
            </div>

          </>
        ) : (
          ""
        )}

      </div>
    </div>
  );
};
export default Post;
