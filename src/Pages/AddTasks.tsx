import React, { useState } from 'react';
import {IconButton, Typography, AppBar, Box, Toolbar, Button, Stack, Alert } from '@mui/material'
import TextField from '@mui/material/TextField';
import {useNavigate} from 'react-router-dom';


function AddTasks() {
    const nav = useNavigate();

    const [title, setTitle] = useState("");

    const [info, setInfo] = useState(false);

    
    //This code creates a new task and using the POST request of the API
    const handleCreate = async () => {

        const new_task = {
            "title": title,
            "isCompleted": false
        }

        try {
          const response = await fetch('https://todo.crudful.com/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              cfAccessKey: `${process.env.REACT_APP_TOKEN}`,
            },
            body: JSON.stringify(new_task),
          });
          if (response.ok) {
            console.log('Task created successfully');
            setInfo(true);
          } else {
            console.error(`Error ${response.status}: ${await response.text()}`);
          }
        } catch (error) {
          console.error(error);
        }
    };

    //Navigate back to the List of Tasks Page
    const navigateToTasks = () => {
        nav('/');
    };

    //Takes the input from the TextField to be used for the POST request
    const handleChange = (event: any) => {
        setTitle(event.target.value);
    };


  return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar style={{ marginBottom: '30px' }} position="static">
            <Toolbar>

                <Typography style={{marginLeft:"40%"}} variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Add Task
                </Typography>

                <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                >
                </IconButton>

            </Toolbar>
        </AppBar>
        
        <TextField onChange={handleChange} size="small" style={{ marginLeft: '15px'}} required id="outlined-basic" label="Title" variant="outlined" />
        <Button style={{ marginLeft: "20px"}} variant="outlined" color="primary" onClick={navigateToTasks}>Cancel </Button>
        <Button style={{ marginLeft: "5px"}} variant="outlined" color="success" onClick={handleCreate}>Create Task</Button>
        
        { info &&
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="success">Task Created Successfully.</Alert>
        </Stack>
        }

    </Box>

  );
}

export default AddTasks;