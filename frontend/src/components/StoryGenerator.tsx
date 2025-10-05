import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, {AxiosError} from "axios";
import ThemeInput from "./ThemeInput.tsx";
import LoadingStatus from "./LoadingStatus.tsx";
import { API_BASE_URL } from "../util.ts";

function StoryGenerator() {
    const navigate = useNavigate()
    const [theme, setTheme] = useState("")
    const [jobId, setJobId] = useState<string | null>(null)
    const [jobStatus, setJobStatus] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let pollInterval: number | undefined;

        if (jobId && jobStatus === "processing") {
            pollInterval = setInterval(() => {
                pollJobStatus(jobId)
            }, 5000)
        }

        return () => {
            if (pollInterval) {
                clearInterval(pollInterval)
            }
        }
    }, [jobId, jobStatus])

    const generateStory = async (theme: string) => {
        setLoading(true)
        setError(null)
        setTheme(theme)

        try {
            const response = await axios.post(`${API_BASE_URL}/stories/create`, {theme})
            const {job_id, status} = response.data
            setJobId(job_id)
            setJobStatus(status)

            pollJobStatus(job_id)
        } catch (err) {
            const error = err as AxiosError;
            setLoading(false)
            setError(`Failed to generate story: ${error.message}`)
        }
    }

    const pollJobStatus = async (id: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/jobs/${id}`)
            const {status, story_id, error: jobError} = response.data
            setJobStatus(status)

            if (status === "completed" && story_id) {
                fetchStory(story_id)
            } else if (status === "failed" || jobError) {
                setError(jobError || "Failed to generate story")
                setLoading(false)
            }

        } catch (err) {
            const error = err as AxiosError;
            if (error.response?.status !== 404) {
                setError(`Failed to check story status: ${error.message}`)
                setLoading(false)
            }
        }
    }

    const fetchStory = async (id: string) => {
        try {
            setLoading(false)
            setJobStatus("completed")
            navigate(`/story/${id}`)
        } catch (err) {
            const error = err as AxiosError;
            setError(`Failed to load story: ${error.message}`)
            setLoading(false)
        }
    }

    const reset = () => {
        setJobId(null)
        setJobStatus(null)
        setError(null)
        setTheme("")
        setLoading(false)
    }

    return <div className="story-generator">
        {error && <div className="error-message">
            <p>{error}</p>
            <button onClick={reset}>Try Again</button>
        </div>}

        {!jobId && !error && !loading && <ThemeInput onSubmit={generateStory}/>}

        {loading && <LoadingStatus theme={theme} />}
    </div>
}

export default StoryGenerator;