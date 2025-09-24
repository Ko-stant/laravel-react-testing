import { useEffect, useMemo, useState } from "react";
import {
  createContact,
  deleteContact,
  listContacts,
  updateContact,
} from "./api";
import type { Contact } from "./types";

/**
 * Simple table that shows paginated contacts and allows for creating,
 * editing, and deleting them.
 */
export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const initialForm = useMemo(
    () => ({ first_name: "", last_name: "", email: "", company: "" }),
    []
  );
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState<Contact | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await listContacts(page, perPage);
      setContacts(res.data);
      setTotal(res.total);
      setLastPage(res.last_page);
    } catch (e) {
      setError("Failed to load contacts. Is the API running on :8081?");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Load contacts when page or perPage changes to keep in sync.
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage]);

  function onEdit(c: Contact) {
    setEditing(c);
    setForm({
      first_name: c.first_name,
      last_name: c.last_name,
      email: c.email,
      company: c.company ?? "",
    });
  }

  function resetForm() {
    setEditing(null);
    setForm(initialForm);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.first_name || !form.last_name || !form.email) {
      setError("First name, last name, and email are required.");
      return;
    }

    try {
      if (editing) {
        await updateContact(editing.id, form);
      } else {
        await createContact(form);
      }
      resetForm();
      await refresh();
    } catch {
      setError("Save failed. Ensure email is unique and fields are valid.");
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this contact?")) return;
    setError(null);
    try {
      await deleteContact(id);
      await refresh();
    } catch {
      setError("Delete failed.");
    }
  }

  const totalPages = lastPage;

  return (
    <div style={{ padding: 20 }}>
      <h1>Contacts</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n} per page
            </option>
          ))}
        </select>
        <button onClick={() => void refresh()} disabled={loading}>
          {loading ? "Loading…" : "Reload"}
        </button>
      </div>

      {error && (
        <div style={{ marginBottom: 12, color: "crimson" }}>{error}</div>
      )}

      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 8, maxWidth: 480, marginBottom: 16 }}
      >
        <h2>{editing ? "Edit Contact" : "New Contact"}</h2>
        <input
          placeholder="First name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          required
        />
        <input
          placeholder="Last name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">{editing ? "Save" : "Create"}</button>
          {editing && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <table
        width="100%"
        cellPadding={8}
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            {["ID", "First", "Last", "Email", "Company", "Actions"].map((h) => (
              <th
                key={h}
                style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.first_name}</td>
              <td>{c.last_name}</td>
              <td>{c.email}</td>
              <td>{c.company ?? "—"}</td>
              <td>
                <button onClick={() => onEdit(c)} style={{ marginRight: 8 }}>
                  Edit
                </button>
                <button onClick={() => void onDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {contacts.length === 0 && !loading && (
            <tr>
              <td colSpan={6}>No contacts found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div
        style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          Prev
        </button>
        <span>
          Page {page} / {totalPages} — Total {total}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
