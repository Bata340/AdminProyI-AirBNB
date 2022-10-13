import React from 'react'
import { Button, Container, IconButton, InputAdornment, TextField } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'

export const Login = (props) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const onSubmitLogin = (event) => {
        event.preventDefault();
        alert("DEBERIA LLAMAR A LA API CON USER Y PASSWORD PARA VALIDAR SI EXISTE. "+
            "SI EXISTE ME DEVUELVE UN JWT SUPONGO Y AHÍ LO METEMOS AL LOCAL STORAGE COMO sessionToken");
    }

    const onPressSignUp = (event) => {
        navigate('/sign-up');
    }

    const toggleSeePassword = (event) => {
        setShowPassword(!showPassword);
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

  return (
    <>
        <form onSubmit = {onSubmitLogin}>
            <Container maxWidth="sm" id="formWrapper">
                <Container className={"LogoContainer"}>
                    <h1>ACA EL LOGO DE NUESTRA COSA</h1>
                </Container>
                <Container className={"inputClass"}>
                    <TextField 
                        label = "Username"
                        type = "text"
                        placeholder = "Username"
                        name = "username"
                        className={"inputStyle"}
                        value={username}
                        onChange = {(event) => setUsername(event.target.value)}
                    />
                </Container>
                <Container className={"inputClass"}>
                    <TextField 
                        label = "Password"
                        type = {showPassword?"text":"password"}
                        placeholder = "Password"
                        name = "password"
                        value={password}
                        onChange = {(event) => setPassword(event.target.value)}
                        className={"inputStyle"}
                        InputProps = {{
                            endAdornment: 
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={toggleSeePassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }}
                    />
                    
                </Container>
                <Container  className={"buttonClass"} maxWidth="sm">
                    <Button type="submit" variant="contained" sx={{fontSize:16}}>Log In</Button>
                    <Button onClick={onPressSignUp} variant="outlined" sx={{fontSize:16}}>Sign Up</Button>
                </Container>
            </Container>
        </form>
    </>
  )
}
