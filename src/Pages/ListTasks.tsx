import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import {IconButton, Typography, AppBar, Box, Toolbar, Button } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import {DataGrid, GridCellEditCommitParams} from '@mui/x-data-grid';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';



function ListTasks() {

    const [rows, setRows] = useState<any[]>([]);

    const nav = useNavigate();


    //THIS FUNCTION DELETES THE APPROPRIATE ROW FROM BOTH TABLE AND THE BACKEND BY SENDIND "DELETE" REQUEST
    async function deleteRow (e: any, row: any) {
        e.stopPropagation();
        let tempRows = [...rows];
    
            try {
                const fetch_url = 'https://todo.crudful.com/tasks/' + row.id;

                await fetch(fetch_url, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    cfAccessKey: `${process.env.REACT_APP_TOKEN}`,
                  },
                });
  
              } catch (error) {
                console.error(error);
            }
          
          let index = tempRows.indexOf(row);
          if (index !== -1){
            tempRows.splice(index, 1);
            setRows([...tempRows]);
          }
    };

    //This is for Editing the Rows. Once the Row information is updated and Save is pressed "PATCH" request
    //is used for updating a particular record
    async function editRow (e: any, row: any) {
        e.stopPropagation();

        const new_task = {
            "title": row.title,
            "isCompleted": false
        }

        try {
            const fetch_url = 'https://todo.crudful.com/tasks/' + row.id;

            const response = await fetch(fetch_url, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                cfAccessKey: `${process.env.REACT_APP_TOKEN}`,
              },
              body: JSON.stringify(new_task),
            });
          if (response.ok) {
            console.log('Task updated successfully');
          } else {
            console.error(`Error ${response.status}: ${await response.text()}`);
          }
        } catch (error) {
          console.error(error);
        }

        
    };

    //THIS USEEFFECT HOOK STORES THE DATA FROM THE API USING "GET" REQUEST AT EACH RENDER
    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch('https://todo.crudful.com/tasks', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  cfAccessKey: `${process.env.REACT_APP_TOKEN}`,
                },
              });
              const data = await response.json();
              setRows(data.results);

            } catch (error) {
              console.error(error);
            }
        };

        fetchData();

    }, []);


    //THESE ARE THE COLUMNS THAT WILL BE USED IN 
    const columns = [
        { field: 'title', headerName: 'Task', width: 247, editable: true, },
        { field: 'actions', headerName: 'Actions', width: 180, renderCell: (params: any) => {
            return (
            <Box>
                <Button
                    onClick={(e: any) => deleteRow(e, params.row)}
                    variant="outlined" color="error" startIcon={<DeleteIcon />}>
                    
                </Button>

                <span> &nbsp;
                <Button
                    onClick={(e: any) => editRow(e, params.row)}
                    variant="outlined" color="primary" startIcon={<DriveFileRenameOutlineIcon />}>
                    Save
                </Button>
                </span>
            </Box>
            );
        } }
    ];

    //Navigation between pages using REACT ROUTER
    const navigateToAddTasks = () => {
        nav('/addtask');
    };

    //This ensures that the value is saved once there are changes made to the row information
    const handleCellEditCommit = (params: GridCellEditCommitParams) => {
        const { id, field, value } = params;
        const updatedRows = [...rows];
        const index = updatedRows.findIndex((row) => row.id === id);
        updatedRows[index] = { ...updatedRows[index], [field]: value };
        setRows(updatedRows);
      };
    

  return (
    <Box sx={{ flexGrow: 1, height: "81vh"}}>
        <AppBar position="static">
            <Toolbar>

                <Typography style={{marginLeft:"40%"}} variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Tasks
                </Typography>

                <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={navigateToAddTasks}
                >
                <AddCircleOutlineIcon fontSize='large' />
                </IconButton>

            </Toolbar>
        </AppBar>

        
        <DataGrid
            style={{marginTop: "15px", marginLeft: "10px", marginRight: "10px"}}
            rows={rows !== null ? rows : []}
            columns={columns}
            pageSize={9}
            rowsPerPageOptions={[1]}
            checkboxSelection
            onCellEditCommit={handleCellEditCommit}
        />

    </Box>

  );
}

export default ListTasks;