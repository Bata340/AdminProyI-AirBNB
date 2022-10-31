import { Container, Grid, CircularProgress } from '@mui/material';
import React from 'react';
import PropertyRequest from './PropertyRequest';
import { getFirebaseImage } from '../../common/FirebaseHandler';
import { useEffect, useState } from 'react';


export const MyPropertiesRequests = () => {

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

    async function getUserProperties(user){
        const paramsUpload = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${API_URL}/properties?owner=${user}`;
        const response = await fetch(
            url,
            paramsUpload
        );
        const jsonResponse = await response.json();
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
        getUserProperties(localStorage.getItem('username'));
    }, []);


    return (    
        !loading ? 
        <Container>
            <Grid container>
                {inmuebles.map( (prop, idx) => {
                    return (
                        <Grid style={{"marginTop":"2rem"}} item xs={12} key={`${prop.key}_${urlsImages[idx]}`}>
                            <PropertyRequest 
                                id={prop.key}
                                key={`${prop.key}_${urlsImages[idx]}`}
                                name={prop.name} 
                                owner={prop.owner} 
                                price={prop.price} 
                                userDescription='Soy un tira piedras y me gusta el faso'
                                user='Franco Batastini'
                                userScore='-2'
                                checkin="10/11/2022"
                                checkout="15/11/2022"
                                photos={ urlsImages.length > 0 ? urlsImages[idx] : []}
                                photosName = {prop.photos}
                            />
                        </Grid>
                    )})}
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
