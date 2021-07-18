import React, {useState} from 'react';
import Header from "../../common/header/Header";
import './Home.css'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import {
    CardActions,
    CardHeader,
    Checkbox,
    GridListTileBar,
    ListItemText,
    MenuItem,
    TextField
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function Home(props){

    const [filterButton,setFilterButton] = useState(false);
    const [filteredMovieGenres,setFilteredMovieGenres] = useState([]);
    const [movieGenres,setMovieGenres] = useState([]);
    const [filteredMovieArtists,setFilteredMovieArtists] = useState([]);
    const [movieArtists,setMovieArtists] = useState([]);
    const [movies,setMovies]=useState([]);
    const [filteredMovies,setFilteredMovies] = useState({
        "movieName":'',
        "releaseDateStart":new Date(),
        "releaseDateEnd":new Date()
    })

    const handleGenreChange = (event) => { setFilteredMovieGenres(event.target.value); };
    const handleArtistChange = (event) => { setFilteredMovieArtists(event.target.value); };
    const inputChangedHandler = (e) => {
        const state = filteredMovies;
        state[e.target.name] = e.target.value;
        setFilteredMovies({...state})
    }

    async function getMovieDetails(){
        try{
            const rawResponse = await fetch('http://localhost:8085/api/v1/movies?page=1&limit=10', {
                method: 'GET',
                headers: {
                    "Accept": "application/json;charset=UTF-8"
                }
            });
            const result = await rawResponse.json();
            if (rawResponse.ok) {
                setMovies(result["movies"]);
            }

        }catch (e) {
            console.log('error');
        }
    }
    async function getGenreDetails(){
        try{
            const rawResponse = await fetch('http://localhost:8085/api/v1/genres', {
                method: 'GET',
                headers: {
                    "Accept": "application/json;charset=UTF-8"
                }
            });
            const result = await rawResponse.json();
            if (rawResponse.ok) {
                setMovieGenres(result["genres"]);
            }

        }catch (e) {
            console.log('error');
        }
    }
    async function getArtistDetails(){
        try{
            const rawResponse = await fetch('http://localhost:8085/api/v1/artists?page=1&limit=10', {
                method: 'GET',
                headers: {
                    "Accept": "application/json;charset=UTF-8"
                }
            });
            const result = await rawResponse.json();
            if (rawResponse.ok) {
                setMovieArtists(result["artists"]);
            }

        }catch (e) {
            console.log('error');
        }
    }

    async function getDetails(){
        await getMovieDetails();
        await getGenreDetails();
        await getArtistDetails();
    }

    const {movieName,releaseDateStart,releaseDateEnd} = filteredMovies;

    return <div onLoad={getDetails}>
        <Header/>
        <div className='homeHeading'>
            Upcoming Movies
        </div>
        <div className='gridDiv'>
            <GridList cols={6} style={{flexWrap: 'nowrap',width:'100%'}}>
                {movies.filter(mv => mv.status !== "RELEASED")
                    .map(movie => (
                    <GridListTile key={movie.id}>
                        <img src={movie.poster_url} alt="image" style={{minWidth:'100%',minHeight:'100%',maxWidth:'100%',maxHeight:'100%'}}/>
                        <GridListTileBar title={movie.title}/>
                    </GridListTile>
                ))}
            </GridList>

        </div>
        <div className='releasedMovieSection'>
            <div className='releasedMovie'>
                <GridList cols={4}>
                    {movies.filter(mv => {
                        if(!filterButton) return mv.status === "RELEASED"
                        else return (mv.status === "RELEASED" &&
                            (((mv.title.toLowerCase() === filteredMovies.movieName.toLowerCase())) ||
                            (new Date(mv.release_date) >= new Date(filteredMovies.releaseDateStart)
                                 && new Date(mv.release_date) <= new Date(filteredMovies.releaseDateEnd)) ||
                            (mv.genres.every(val => filteredMovieGenres.includes(val))) ||
                                ((mv.artists.map(mvv => mvv["first_name"]+" "+mvv["last_name"]))
                                    .every(val => filteredMovieArtists.includes(val)))
                             ))

                    })
                        .map(movie => (
                        <GridListTile key={movie.id} style={{height:'350px',cursor: 'pointerTypography'}}>
                        <Link to={"/movie/"+movie.id}><img src={movie.poster_url} alt="image"
                                                           style={{minWidth:'100%',minHeight:'100%',maxWidth:'100%',maxHeight:'100%'}}/></Link>
                        <GridListTileBar title={movie.title} subtitle={"Release Date "+new Date(movie.release_date).toDateString()}/>
                        </GridListTile>
                    ))}
                </GridList>

            </div>
            <div className="filter">

                <Card>
                    <CardContent style={{margin:'16px',minWidth:'',maxWidth:'240px'}}>
                        <CardHeader title={<Typography variant="h6" style={{color:'cornFlowerBlue'}}>FIND MOVIES BY:</Typography>} color="theme.palette.primary.light"/>
                        <FormControl >
                            <InputLabel htmlFor="movieName">Movie Name</InputLabel>
                            <Input id="movieName" name="movieName" aria-describedby="my-helper-text" onChange={inputChangedHandler}/>
                        </FormControl> <br/>


                        <FormControl style={{minWidth:185}}>
                            <InputLabel htmlFor="genres">Genres</InputLabel>
                            <Select labelId="label" id="genres" multiple value={filteredMovieGenres} onChange={handleGenreChange} input={<Input />}
                                    renderValue={(selected) => selected.join(', ')} MenuProps={MenuProps}>
                                {movieGenres.map((genres) => (
                                    <MenuItem key={genres.id} value={genres["genre"]}>
                                        <Checkbox checked={filteredMovieGenres.indexOf(genres["genre"]) > -1} />
                                        <ListItemText primary={genres["genre"]} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl> <br/>


                        <FormControl style={{minWidth:185}}>
                            <InputLabel htmlFor="artists">Artists</InputLabel>
                            <Select labelId="label" id="artists" multiple value={filteredMovieArtists} onChange={handleArtistChange} input={<Input />}
                                    renderValue={(selected) => selected.join(', ')} MenuProps={MenuProps}>
                                {movieArtists.map((artists) => (
                                    <MenuItem key={artists.id} value={artists["first_name"]+" "+artists["last_name"]}>
                                        <Checkbox checked={filteredMovieArtists.indexOf(artists["first_name"]) > -1} />
                                        <ListItemText primary={artists["first_name"]+" "+artists["last_name"]} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl> <br/>


                        <FormControl style={{minWidth:185}}>
                            <TextField
                                id="releaseDateStart"
                                name="releaseDateStart"
                                label="Release Date Start"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={inputChangedHandler}
                            />
                        </FormControl> <br/>
                        <FormControl style={{minWidth:185}}>
                            <TextField
                                id="releaseDateEnd"
                                name="releaseDateEnd"
                                label="Release Date end"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={inputChangedHandler}
                            />
                        </FormControl> <br/>
                            <CardActions >
                                <Button variant="contained" color="primary" name="apply" type="submit" onClick={() => setFilterButton(true)} style={{minWidth:185}}> APPLY </Button>
                            </CardActions>
                    </CardContent>
                </Card>

            </div>
        </div>
    </div>
}
