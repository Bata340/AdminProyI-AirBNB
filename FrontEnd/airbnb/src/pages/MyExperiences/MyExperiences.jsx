import { Container, Grid, CircularProgress } from '@mui/material';
import React from 'react';
import MyExperience from './MyExperience';
import { getFirebaseImage } from '../../common/FirebaseHandler';
import { useEffect, useState } from 'react';


export const MyExperiences = () => {

    const API_URL = 'http://localhost:8000';

    const [ inmuebles, setInmuebles ] = useState ( [] );
    const [ loading, setLoading ] = useState( true );
    const [ urlsImages, setUrlsImages ] = useState( [] );

    async function getImagesFromFireBase( inmueblesVar ){
        const urlsArray = [];
        for ( let i=0; i < inmueblesVar.length ; i++ ){
            const arrayURLS = [];
            for ( let j=0; j < inmueblesVar[i].photos.length ; j++ ){
                const url = await getFirebaseImage( 
                    `files/${inmueblesVar[i].photos[j]}`
                );
                arrayURLS.push(url);
            }
            urlsArray.push(arrayURLS);
        }
        setUrlsImages( urlsArray );
        setInmuebles( inmueblesVar );
        setLoading( false );
    }

    async function getUserExperiences(user){
        const paramsUpload = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${API_URL}/experiences?owner=${user}`;
        const response = await fetch(
            url,
            paramsUpload
        );
        const jsonResponse = await response.json();
        {console.log(jsonResponse)}

        if (response.status === 200){
            if(!jsonResponse.status_code){
                const arrayProps = [];
                const keys = Object.keys(jsonResponse);
                for ( let i=0; i<keys.length; i++){
                    arrayProps.push(jsonResponse[keys[i]]);
                }
                await getImagesFromFireBase(arrayProps);
            }
        }     
    }


    useEffect( () => {
        getUserExperiences(localStorage.getItem('username'));
    }, []);


    return (    
        !loading ? 
        <Container>
            <Grid container spacing={5}>
                {inmuebles.length > 0 ? 
                    inmuebles.map( (exp, idx) => {
                        return (
                            <Grid style={{"marginTop":"2rem"}} item xs={4} key={`${exp.key}_${urlsImages[idx]}`}>
                                <MyExperience
                                    id={exp.key}
                                    key={`${exp.key}_${urlsImages[idx]}`}
                                    name={exp.name} 
                                    owner={exp.owner} 
                                    price={exp.price} 
                                    description={exp.description} 
                                    location={exp.location} 
                                    score={exp.score} 
                                    photos={ urlsImages.length > 0 ? urlsImages[idx] : []}
                                    photosName = {exp.photos}
                                />
                            </Grid>
                        )
                    }) : 
                    <Grid style={{marginTop:"3rem", textAlign:"center"}} item xs={12}>
                        <h4>You have no experiences uploaded yet.</h4>
                    </Grid>
                }
            </Grid>
        </Container>
        : <CircularProgress 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            margin: 'auto',
            width: '10vw'
          }}
        />
    ) ;
}
