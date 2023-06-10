import { useEffect, useState } from "react";
import { config } from "./config";
import ReactLoading from "react-loading";
import './Feed.css';

import Badge from "react-bootstrap/Badge";

const AiIdea = ({ content }) => {
  const paragraphs = content.split("\n\n")
  return (
    paragraphs.map(par =>
      <p>{par}</p>
    )
  )
}

const FeedTile = ({
  title,
  date,
  source,
  conversation
}) => {
  return (
    <div className='feed-box'>
      <div className='badge'>
        <Badge bg={source==="work"?"primary":"secondary"}>{source}</Badge>
      </div>
      <div className="title" >{title} on {new Date(date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      <div className="ai-label" >AI - Generated:</div>
      {
        conversation.filter(chat => chat.role === "assistant")
          .map(aiChat =>
            <div className="ai-box">
              <AiIdea {...aiChat}></AiIdea>
            </div>
          )
      }
    </div>
  )
}

const Feed = () => {
  const [data, setdata] = useState(null);

  useEffect(() => {
    if (!data) {
      fetch(config.connections.yoda + "/feed", {
        method: "GET",
      })
        .then((response) =>
          response.json().then((response) => {
            setdata(response.feed)
          }
          )
        )
        .catch((error) => console.log(error));
    }
  });

  return (
    <>
      <h5>
        <center className="top-title" >R2 Feed</center>
      </h5>
      {data ? (
        data.map(oneFeed => {
          return (
            <FeedTile {...oneFeed} key={oneFeed._id}></FeedTile>
          )
        })
      ) : (
        <h5>
          <center>
            <ReactLoading type="bubbles" color="#6ca886" />
          </center>
        </h5>
      )}
    </>
  );
};


export default Feed;
