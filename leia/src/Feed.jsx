import './Leia.css';
import { useEffect, useState } from "react";
import { config } from "./config";
import ReactLoading from "react-loading";

const FeedTile = ({title}) => {
  return (
    <div>
      {title}
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
        <center>R2 Feed</center>
      </h5>
      {data ? (
        data.map(oneFeed => {
          return (
            <FeedTile {...oneFeed}></FeedTile>
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
