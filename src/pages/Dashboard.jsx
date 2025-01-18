import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import { Button } from '@mui/material';



const paginationModel = { page: 0, pageSize: 5 };

export default function Dashboard() {
    const columns = [
        { field: 'id', headerName: 'ID', width: 20 },
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'notes', headerName: 'Notes', flex: 1 },
        {
            field: 'date',
            headerName: 'Date',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 190,
            valueFormatter: (value) => {
                if (value == null) {
                    return '';
                }
                return `${new Date(value).toDateString()}`;
            },
        },
        {
            field: 'repeatFrequency',
            headerName: 'Repeated',
            type: 'string',
            width: 80,
        },
        {
            field: 'type',
            headerName: 'Type',
            type: 'string',
            width: 80,
        },
        {
            field: "action",
            headerName: "Action",
            sortable: false,
            disableClickEventBubbling: true,
            width: 120,
            renderCell: (params) => {
                const deleteRow = () => {
                    axios.delete('http://localhost:8000/api/task/' + params.id)
                        .then(() => {
                            alert('Row successfully deleted')
                            setTasks(tasks.filter((row) => row.id !== params.id));
                        })
                        .catch(err => console.log(err));
                };
                return (
                    <div>
                        <a href={`/edit/${params.id}`}>Edit</a>
                        <Button onClick={deleteRow}>Delete</Button>
                    </div>);
            }
        },
    ];

    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    const { token } = useAuth();

    const promise = axios.get("http://localhost:8000/api/tasks", { headers: { "Authorization": `Bearer ${token}` } })
        .then(({ data }) => data);

    useEffect(() => {
        promise.then(setTasks)
            .catch(err => {
                console.error(err);
                navigate("/login", { replace: true });
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className='parentDiv'>
            <a href='/logout' className='logout'>Logout</a>
            <a href='/create'>Create new task</a>
            <DataGrid
                className={'dataGrid'}
                rows={tasks}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                sx={{ border: 0 }}
            />
        </div>
    );
}