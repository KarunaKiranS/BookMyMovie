import React, {useState} from 'react';
import Header from "../../common/header/Header";
import { Link} from "react-router-dom";
import './Details.css';
import Typography from "@material-ui/core/Typography";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import Rating from "@material-ui/lab/Rating";
import GridListTile from "@material-ui/core/GridListTile";
import {GridListTileBar} from "@material-ui/core";
import GridList from "@material-ui/core/GridList";
import YouTube from "react-youtube";

export default function Details(props){

    const [movieDetails,setMovieDetails]=useState({});
    const [genres,setGenres] = useState([]);
    const [artists,setArtists] = useState([]);
    const [videoId,setVideoId] = useState("")

    async function getMovieDetails(){
        try{
            const rawResponse = await fetch('http://localhost:8085/api/v1/movies/'+props.match.params.id, {
                method: 'GET',
                headers: {
                    "Accept": "application/json;charset=UTF-8"
                }
            });
            const result = await rawResponse.json();
            if (rawResponse.ok) {
                setMovieDetails(result);
                setGenres(result["genres"]);
                setArtists(result["artists"]);
                setVideoId(result["trailer_url"]);
            }

        }catch (e) {
        }
    }

    return <div onLoad={getMovieDetails}>
        <Header bookShow={true} id={props.match.params.id}/>
        <div  className="back">
        <Typography>
            <Link to={"/"}>
                &#60; Back to Home
            </Link>
        </Typography>
        </div>
        <div className="detailsGrid">
            <div className="leftPart" >
                <img src={movieDetails["poster_url"]} alt="poster url" style={{minWidth:'80%',minHeight:'50%',maxWidth:'80%',maxHeight:'50%'}}/>
            </div>
            <div className="middlePart">
                <Typography variant='h2'>{movieDetails["title"]}</Typography>
                <Typography><b>Genre: </b>{
                    genres.map(function(item, index) {
                        return <span key={`genre${index}`}>{ (index ? ', ' : '') + item }</span>;
                    })
                }</Typography>
                <Typography><b>Duration: </b>{movieDetails["duration"]}</Typography>
                <Typography><b>Release Date: </b>{new Date(movieDetails["release_date"]).toDateString()}</Typography>
                <Typography><b>Rating: </b>{movieDetails["rating"]}</Typography>
                <Typography style={{marginTop:'16px'}}><b>Plot: </b>(<a href={movieDetails["wiki_url"]}>Wiki Link </a>){movieDetails["storyline"]}</Typography>
                <Typography style={{marginTop:'16px'}}><b>Trailer: </b><br/><YouTube videoId={videoId.substring(videoId.indexOf('=')+1)}/></Typography>
            </div>
            <div className="rightPart">
                <Typography><b>Rate this movie: </b><br/>
                     <Rating name='rating' emptyIcon={<StarBorderIcon/>}/>
                </Typography>
                <div style={{marginTop: '16px',marginBottom: '16px'}}>
                    <Typography><b>Artists:</b>
                        <GridList cols={2} style={{marginTop: '16px'}}>
                            {artists.map(artist => (
                                <GridListTile key={artist.id} style={{border: '1px solid lightGrey'}}>
                                    <img src={artist["profile_url"]} alt="profile_url" style={{minWidth:'100%',minHeight:'100%',maxWidth:'100%',maxHeight:'100%'}}/>
                                    <GridListTileBar title={artist["first_name"] +" "+ artist["last_name"]}/>
                                </GridListTile>
                            ))}
                        </GridList>
                    </Typography>
                </div>
            </div>
        </div>
    </div>
}