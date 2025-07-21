import React, { useEffect, useState } from 'react';
import './App.css'

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const RUN_DEV = import.meta.env.VITE_RUN_DEV === 'true';

if (RUN_DEV) {
  API_BASE_URL = 'http://localhost:5000'
}

const initialBudget = {
  housing: '',
  utilities: '',
  groceries: '',
  transportation: '',
  insurance: '',
  healthcare: '',
  childcare: '',
  debt: '',
  phone_internet: '',
};

function App() {
  const [budget, setBudget] = useState(initialBudget);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/budgets`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setBudget({ ...initialBudget, ...data[0] });
        }
      })
      .catch(() => setMessage('Failed to load budget data.'))
      .finally(() => setLoading(false));
  }, []);

  // Add a helper to format numbers with commas
  const formatNumber = (value: string) => {
    const num = value.replace(/[^\d]/g, '');
    if (!num) return '';
    return parseInt(num, 10).toLocaleString();
  };

  const handleFormattedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Remove all non-digit characters
    const numericValue = value.replace(/[^\d]/g, '');
    setBudget(prev => ({ ...prev, [name]: numericValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    fetch(`${API_BASE_URL}/budgets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budget),
    })
      .then(() => setMessage('Budget saved!'))
      .catch(() => setMessage('Failed to save budget.'))
      .finally(() => setSaving(false));
  };

  const categories = [
    { key: 'housing', label: 'Housing' },
    { key: 'utilities', label: 'Utilities' },
    { key: 'groceries', label: 'Groceries / Food at Home' },
    { key: 'transportation', label: 'Transportation' },
    { key: 'insurance', label: 'Insurance' },
    { key: 'healthcare', label: 'Healthcare / Medical' },
    { key: 'childcare', label: 'Childcare / Schooling' },
    { key: 'debt', label: 'Debt Payments' },
    { key: 'phone_internet', label: 'Phone / Internet' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col p-4">
      <h1 className="text-4xl font-extrabold text-blue-300 mb-8 drop-shadow">Budget FI App</h1>
      <div className="w-full max-w-xl">
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-10 border border-gray-700">
          {loading ? (
            <div className="text-lg text-blue-400 font-semibold">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <table className="w-full">
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.key} className="mb-4">
                      <td className="text-gray-300 text-sm font-medium text-left w-48 pr-4 align-middle">
                        <label htmlFor={cat.key}>{cat.label}</label>
                      </td>
                      <td className="align-middle">
                        <span className="relative inline-flex items-center w-full">
                          <span className="absolute left-3 text-gray-400 pointer-events-none select-none">$</span>
                          <input
                            id={cat.key}
                            name={cat.key}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9,]*"
                            value={formatNumber(budget[cat.key as keyof typeof budget])}
                            onChange={handleFormattedChange}
                            className="w-full rounded-lg border border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-900 pl-7 pr-4 py-2 text-gray-100 bg-gray-800 transition placeholder:text-gray-400 outline-none shadow-sm hover:border-blue-400"
                            placeholder={`Enter amount`}
                            autoComplete="off"
                          />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 transition text-white font-semibold py-3 rounded-lg shadow-md disabled:opacity-60"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Budget'}
              </button>
              {message && <div className="text-red-400 font-medium">{message}</div>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default App
