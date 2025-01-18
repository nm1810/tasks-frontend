import { useState } from "react";
import axios from "axios";

export default function Create() {
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [repeatFrequency, setRepeatFrequency] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [type, setType] = useState('email');

    const handleCreate = () => {
        setError('');
        setSuccess('');
        axios.post('http://localhost:8000/api/task', {
            notes: notes,
            title: title,
            repeatFrequency: repeatFrequency,
            date: date,
            type: type
        }).then(function () {
            setSuccess('Successfully created task');
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
                    <option value="email">Email</option>
                    <option value="desktop">Desktop</option>
                </select>
                <input className={'inputButton'} type="button" onClick={handleCreate} value={'Submit'} />
            </form>
        </div>
    )
}