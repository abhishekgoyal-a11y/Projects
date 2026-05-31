import {
  AlertTriangle,
  Bot,
  Braces,
  CheckCircle2,
  ClipboardList,
  FileText,
  Loader2,
  Send,
  Sparkles,
  UploadCloud,
  Wand2,
  X
} from "lucide-react";
import { useMemo, useState } from "react";
import { createJiraTicket, generateTicket } from "./api.js";

const logPlaceholder = `Paste logs here or drop a file above...

Example:
2026-05-28T14:22:08Z ERROR checkout-service TypeError: Cannot read properties of undefined
    at calculateCartTotal (/app/services/cart.js:41:18)`;

const MAX_FILE_SIZE = 1024 * 1024;
const ACCEPTED_FILE_TYPES = ".log,.txt,.json,.stacktrace,text/plain,application/json";

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{value || "Not available"}</strong>
    </div>
  );
}

export default function App() {
  const [logs, setLogs] = useState("");
  const [source, setSource] = useState("checkout-service");
  const [severityHint, setSeverityHint] = useState("Auto");
  const [ticket, setTicket] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [jiraResult, setJiraResult] = useState(null);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creatingJira, setCreatingJira] = useState(false);

  const canCreateJira = useMemo(() => ticket && !creatingJira, [ticket, creatingJira]);

  async function handleGenerate(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setJiraResult(null);

    try {
      const data = await generateTicket({ logs, source, severityHint });
      setTicket(data.ticket);
      setMetadata(data.metadata);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateJira() {
    setCreatingJira(true);
    setError("");

    try {
      const data = await createJiraTicket(ticket);
      setJiraResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreatingJira(false);
    }
  }

  function readLogFile(file) {
    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Please upload a log file smaller than 1 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setLogs(String(reader.result || ""));
      setFileName(file.name);
      setError("");
      setTicket(null);
      setMetadata(null);
      setJiraResult(null);
    };
    reader.onerror = () => {
      setError("Could not read that file. Please try another log file.");
    };
    reader.readAsText(file);
  }

  function handleFileChange(event) {
    readLogFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    readLogFile(event.dataTransfer.files?.[0]);
  }

  function clearFile() {
    setFileName("");
    setLogs("");
    setTicket(null);
    setMetadata(null);
    setJiraResult(null);
  }

  return (
    <main className="app-shell">
      <section className="topbar">
        <div className="brand-row compact">
          <div className="brand-mark">
            <Bot size={24} />
          </div>
          <div>
            <h1>AI Bug Ticket Generator</h1>
            <p>Turn noisy logs into clean Jira-ready bug reports with Groq.</p>
          </div>
        </div>
        <div className="status-pill">
          <Sparkles size={16} />
          Groq powered
        </div>
      </section>

      <section className="hero-strip">
        <div>
          <span className="eyebrow">Log analysis workspace</span>
          <h2>Paste an error trace. Get a useful ticket in seconds.</h2>
          <p>
            The app extracts severity, likely root cause, reproduction steps, and a polished issue description that your team can send to Jira.
          </p>
        </div>
        <div className="metrics-grid" aria-label="Project highlights">
          <div>
            <strong>3</strong>
            <span>Signals tracked</span>
          </div>
          <div>
            <strong>JSON</strong>
            <span>Structured output</span>
          </div>
          <div>
            <strong>Jira</strong>
            <span>Optional export</span>
          </div>
        </div>
      </section>

      <section className="workspace">
        <form className="input-panel" onSubmit={handleGenerate}>
          <div className="panel-title">
            <Braces size={20} />
            <div>
              <h3>Raw log input</h3>
              <p>Add a service name and paste the failing trace.</p>
            </div>
          </div>

          <div className="field-grid">
            <label>
              Source
              <input value={source} onChange={(event) => setSource(event.target.value)} />
            </label>
            <label>
              Severity
              <select value={severityHint} onChange={(event) => setSeverityHint(event.target.value)}>
                <option>Auto</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </label>
          </div>

          <label className="logs-field">
            Logs or Error Trace
            <div
              className={`drop-zone ${isDragging ? "is-dragging" : ""}`}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDrop={handleDrop}
            >
              <input id="log-file" type="file" accept={ACCEPTED_FILE_TYPES} onChange={handleFileChange} />
              <UploadCloud size={30} />
              <div>
                <strong>Drop a log file here</strong>
                <span>or choose a `.log`, `.txt`, `.json`, or stack trace file</span>
              </div>
              <label className="file-picker" htmlFor="log-file">
                Choose File
              </label>
            </div>

            {fileName && (
              <div className="file-chip">
                <FileText size={16} />
                <span>{fileName}</span>
                <button type="button" onClick={clearFile} aria-label="Clear uploaded file">
                  <X size={14} />
                </button>
              </div>
            )}

            <textarea value={logs} onChange={(event) => setLogs(event.target.value)} placeholder={logPlaceholder} />
          </label>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? <Loader2 className="spin" size={18} /> : <Wand2 size={18} />}
            {loading ? "Generating" : "Generate Ticket"}
          </button>
        </form>

        <section className="output-panel">
          <div className="panel-heading">
            <ClipboardList size={22} />
            <h2>Generated Ticket</h2>
          </div>

          {error && (
            <div className="error-banner">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          {!ticket && !error && (
            <div className="empty-state">
              <Sparkles size={34} />
              <h3>Your generated ticket will appear here</h3>
              <p>Paste logs, choose a source, and create a clear bug ticket draft.</p>
            </div>
          )}

          {ticket && (
            <div className="ticket-card">
              <div className="ticket-header">
                <span>{ticket.severity}</span>
                <h3>{ticket.title}</h3>
              </div>

              <p>{ticket.summary}</p>

              <div className="details">
                <DetailRow label="Confidence" value={ticket.confidence} />
                <DetailRow label="Root cause" value={ticket.rootCauseHypothesis} />
                <DetailRow label="Log lines" value={metadata?.lineCount} />
                <DetailRow label="Errors" value={metadata?.errorCount} />
              </div>

              <div className="description-block">
                <h4>Description</h4>
                <pre>{ticket.description}</pre>
              </div>

              <div className="description-block">
                <h4>Steps to Reproduce</h4>
                <ol>
                  {(ticket.stepsToReproduce || []).map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>

              <button className="secondary-button" type="button" disabled={!canCreateJira} onClick={handleCreateJira}>
                {creatingJira ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
                {creatingJira ? "Creating Jira" : "Create Jira Ticket"}
              </button>

              {jiraResult && (
                <a className="jira-link" href={jiraResult.url} target="_blank" rel="noreferrer">
                  <CheckCircle2 size={18} />
                  Open {jiraResult.key}
                </a>
              )}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
