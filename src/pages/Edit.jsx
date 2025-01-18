import { useParams } from 'react-router';
import { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Edit() {
    const params = useParams();
    const navigate = useNavigate();
    const { token, setToken } = useAuth();

    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [repeatFrequency, setRepeatFrequency] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [type, setType] = useState('');

    const handleEdit = () => {
        setError('');
        setSuccess('');
        axios.put('http://localhost:8000/api/task/' + params.id, {
            notes: notes,
            title: title,
            repeatFrequency: repeatFrequency,
            date: date,
            type: type
        }).then(function () {
            setSuccess('Successfully updated task');
        }).catch(err => {
            if (err.response.data.status == "400") {
                setError(err.response.data.errors);
            } else if (err.response.data.status == "401") {
                setError('Unauthorized');
            } else {
                setError('Uknown error');
            }
        });
    };

    const promise = axios.get("http://localhost:8000/api/task/" + params.id, { headers: { "Authorization": `Bearer ${token}` } })
        .then(({ data }) => data);

    useEffect(() => {
        promise.then(data => {
            setTitle(data.title)
            setNotes(data.notes)
            setRepeatFrequency(data.repeatFrequency)

            let date = new Date(data.date);
            date = date.getFullYear() + '-' + ((date.getMonth() < 10) ? '0' : '') + date.getMonth() + '-' + ((date.getDay() < 10) ? '0' : '') + date.getDay();
            setDate(date);
        })
            .catch(err => {
                if (err.response.data.code == "400") {
                    setError(err.response.data.errors);
                } else if (err.response.data.code == "401") {
                    setError('Unauthorized, redirecting to login');
                    setToken();
                    navigate("/", { replace: true });
                }
            });
    }, [setToken, navigate, promise]);
    return (
        <div>
            <a href="/" className='back-button'>Back to Dashboard</a>
            <form className='edit-form'>
                <label className='errorLabel'>{error}</label>
                <label className='successLabel'>{success}</label>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Title goes here.."
                    value={title}
                    onChange={(ev) => setTitle(ev.target.value)}
                />

                <label htmlFor="notes">Notes</label>
                <input
                    type="text"
                    id="notes"
                    name="notes"
                    placeholder="Note goes here.."
                    value={notes}
                    onChange={(ev) => setNotes(ev.target.value)}
                />

                <label htmlFor="repeatFrequency">Repeated frequency (ISO 8601 Duration) </label>
                <input
                    type="text"
                    id="repeatFrequency"
                    name="repeatFrequency"
                    placeholder="PT30S"
                    value={repeatFrequency}
                    onChange={(ev) => setRepeatFrequency(ev.target.value)}
                />

                <label htmlFor="repeatFrequency">Date</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    placeholder="Date on which to notify first"
                    value={date}
                    onChange={(ev) => setDate(ev.target.value)}
                />

                <label htmlFor="type">Type</label>
                <select
                    id="type"
                    name="type"
                    onChange={(ev) => setType(ev.target.value)}
                >
                    <option value={"email"}>Email</option>
                    <option value={"desktop"}>Desktop</option>
                </select>
                <input className={'inputButton'} type="button" onClick={handleEdit} value={'Submit'} />
            </form>
        </div>
    )
}