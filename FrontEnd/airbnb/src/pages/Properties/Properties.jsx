import { Container, Grid, CircularProgress } from '@mui/material';
import React from 'react';
import Property from './Property';
import { getFirebaseImage } from '../../common/FirebaseHandler';
import { useEffect, useState } from 'react';


export const Properties = () => {

    //En photos tiene que ir el nombre de la foto de firebase
    const [inmuebles, setInmuebles] = useState ([
        {key:1, name:"Cabaña1", owner:"generico", price:12, description:"descripcion cabaña 1", location:"CABA", score:1, photos:["1b05797bb2fea225f8c5f536497c922d.jpg"]},
        {key:2, name:"Cabaña2", owner:"generico", price:123, description:"descripcion cabaña 2", location:"Tierra del Fuego", score:2, photos:["227437cbae8576fa0660f90b4fb803c4.png","1b05797bb2fea225f8c5f536497c922d.jpg","364046840f5e0e09503134bd790bd924.jpg"]},
        {key:3, name:"Hotel 1", owner:"generico", price:1234, description:"descripcion Hotel", location:"Cordoba", score:4, photos:["364046840f5e0e09503134bd790bd924.jpg","1b05797bb2fea225f8c5f536497c922d.jpg","364046840f5e0e09503134bd790bd924.jpg"]},
        {key:4, name:"Hotel 1", owner:"generico", price:1234, description:"descripcion Hotel", location:"Cordoba", score:4, photos:["364046840f5e0e09503134bd790bd924.jpg"]},
        {key:5, name:"Hotel 1", owner:"generico", price:1234, description:"descripcion Hotel", location:"Cordoba", score:4, photos:["1b05797bb2fea225f8c5f536497c922d.jpg"]},
        {key:6, name:"Hotel 1", owner:"generico", price:1234, description:"descripcion Hotel", location:"Cordoba", score:4, photos:["227437cbae8576fa0660f90b4fb803c4.png"]}
    ]);

    const [ imagesLoading, setImagesLoading] = useState( true );
    const [ urlsImages, setUrlsImages ] = useState( [] );


    useEffect( () => {

        async function getImagesFromFireBase(inmuebles){
            const urlsArray = [];
            for ( let i=0; i < inmuebles.length ; i++ ){
                const url = await getFirebaseImage( 
                    inmuebles[i].photos[0] 
                );
                urlsArray.push(url);
            }
            setUrlsImages( urlsArray );
            setImagesLoading( false );
        }
        
        getImagesFromFireBase(inmuebles);

    }, [inmuebles]);
    

    return (
        !imagesLoading ? 
        <Container>
            <Grid container>
                
                {inmuebles.map( (prop, idx) => {
                    console.log(urlsImages);
                    console.log(idx);
                    return (
                        <Grid style={{"marginTop":"2rem"}} item xs={4} key={`${prop.key}_${urlsImages[idx]}`}>
                            <Property 
                                key = {`${prop.key}_${urlsImages[idx]}`}
                                name={prop.name} 
                                owner={prop.owner} 
                                price={prop.price} 
                                description={prop.description} 
                                location={prop.location} 
                                score={prop.score} 
                                photos={ urlsImages.length > idx ? urlsImages[idx]: "" }
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
