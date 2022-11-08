import {useState, useEffect} from 'react';
import {Container, Grid, Rating, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';

export const ReviewProperties = () => {

  const [propertiesToReview, setPropertiesToReview] = useState([]);
  const [scores, setScores] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [dataDialog, setDataDialog] = useState({"user": null, "score": null})
  const API_URL = "http://localhost:8000"

  const getPropertiesToReview = async () => {
    const paramsGet = {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
      }
    };
    const url = `${API_URL}/reviews/get-properties-to-review/${localStorage.getItem("username")}`;
    const response = await fetch(
        url,
        paramsGet
    );
    const jsonResponse = await response.json();
    if (response.status === 200){
        if(!jsonResponse.status_code){
          let scoresInitial = {};
          for (let i=0; i<jsonResponse.length; i++){
            scoresInitial = {...scoresInitial, [jsonResponse[i].key]: 0};
          }
          setScores(scoresInitial);
          setPropertiesToReview(jsonResponse);
        }
    }    
  }


  useEffect(() => {
     getPropertiesToReview();
  // eslint-disable-next-line
  }, []);


  const submitReview = async (property) => {
    const paramsPatch = {
      method: "PATCH",
      headers: {
          'Content-Type': 'application/json',
      }
    };
    const url = `${API_URL}/property/score/${property.key}?owner_user=${localStorage.getItem("username")}&score=${scores[property.key]}`;
    const response = await fetch(
        url,
        paramsPatch
    );
    const jsonResponse = await response.json();
    if (response.status === 200){
        if(!jsonResponse.status_code){
          setDataDialog({"propertyName":property.property.name, "score":scores[property.key]});
          setShowDialog(true);
          setPropertiesToReview(propertiesToReview.filter(propInArray => propInArray.key != property.key));
        }
    }
  }
  
  
  return (
    <Container style={{marginTop:"3rem"}}>
        <h1 style={{textDecoration:"underline"}}>Review Properties</h1>
        <Grid container >
          {propertiesToReview.length > 0 ?
          propertiesToReview.map(property => {
            return(
              <Grid 
                item container justifyContent="center" alignItems="center" xs={12} md={3}
                key={property.key} style={{border:"1px solid black", borderRadius: "10px", marginTop:"1rem"}}
              >
                <Grid item xs={12} container justifyContent="center" alignItems="center">
                  <h4>{property.property.name}</h4>
                </Grid>
                <Grid item xs={12} container justifyContent="center" alignItems="center">
                  <Rating 
                    value={scores[property.key] ? scores[property.key]: 0} 
                    onChange={(event) => {setScores({...scores, [property.key]:parseInt(event.target.value)});}}
                  />
                </Grid>
                <Grid item xs={12} container justifyContent="center" alignItems="center">
                  <Button style={{textAlign:"center", margin:"auto"}} onClick={() => submitReview(property)}>Submit Review</Button>
                </Grid>
              </Grid>
            )
          }): 
          <Grid item container justifyContent="center" alignItems="center" xs={12} style={{marginTop:"1rem"}}>
            <h4 style={{textAlign:"center"}}>You have no properties to review yet. First you have to finish a reservation in a property.</h4>
          </Grid>
          }
        </Grid>
        <Dialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Property Reviewed Correctly
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              The property "{dataDialog["propertyName"]}" was correctly reviewed with a score of {dataDialog["score"]}.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDialog(false)}>Ok</Button>
          </DialogActions>
        </Dialog>
    </Container>
    
  );
}
