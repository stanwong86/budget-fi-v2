import React, { useEffect, useState } from 'react';
import './App.css'

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
    fetch('http://localhost:5000/budgets')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setBudget({ ...initialBudget, ...data[0] });
        }
      })
      .catch(() => setMessage('Failed to load budget data.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBudget(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    fetch('http://localhost:5000/budgets', {
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
              {categories.map(cat => (
                <div key={cat.key} className="flex items-center space-x-4 mb-4">
                  <label htmlFor={cat.key} className="text-gray-300 text-sm font-medium text-left w-48">
                    {cat.label}
                  </label>
                  <input
                    id={cat.key}
                    name={cat.key}
                    type="number"
                    min="0"
                    step="1"
                    value={budget[cat.key as keyof typeof budget]}
                    onChange={handleChange}
                    className="flex-1 rounded-lg border border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-900 px-4 py-2 text-gray-100 bg-gray-800 transition placeholder:text-gray-400 outline-none shadow-sm hover:border-blue-400"
                    placeholder={`Enter amount`}
                  />
                </div>
              ))}
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
