import { Container, Grid } from '@mui/material';
import React from 'react';
import Property from './Property.js';

export const Properties = () => {
    const inmuebles = [
        {name:"Cabaña1", owner:"generico", price:12, description:"descripcion cabaña 1", location:"CABA", score:1, photos:"https://i.imgur.com/uin9MFj.jpeg"},
        {name:"Cabaña2", owner:"generico", price:123, description:"descripcion cabaña 2", location:"Tierra del Fuego", score:2, photos:"https://i.imgur.com/uin9MFj.jpeg"},
        {name:"Hotel 1", owner:"generico", price:1234, description:"descripcion Hotel", location:"Cordoba", score:4, photos:"https://i.imgur.com/udfEWND.jpeg"}
    ]

    return (
        <Container>
            <Grid container>
                {inmuebles.map(prop => (
                    <Grid item xs={4}>
                        <Property name={prop.name} owner={prop.owner} price={prop.price} description={prop.description} location={prop.location} score={prop.score} photos={prop.photos}/>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
