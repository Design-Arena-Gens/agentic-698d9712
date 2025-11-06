"use client";
import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";

export default function TeacherPage() {
  const store = useAppStore();
  const { currentUser, db } = store;
  const kindergartenId = currentUser?.kindergartenId;
  const branchId = currentUser?.branchId;

  const students = useMemo(
    () => db.students.filter((s) => s.kindergartenId === kindergartenId && (!branchId || s.branchId === branchId)),
    [db.students, kindergartenId, branchId]
  );

  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [statuses, setStatuses] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  if (!currentUser || !kindergartenId) {
    return <div className="text-sm text-red-600">Please login as Teacher with a kindergarten selected.</div>;
  }

  const submit = () => {
    Object.entries(statuses).forEach(([studentId, status]) => {
      store.markAttendance(kindergartenId, studentId, date, status, { branchId });
    });
    setStatuses({});
    alert('Attendance saved');
  };

  return (
    <div className="grid gap-8">
      <section className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold mb-3">Attendance</h2>
        <div className="mb-3">
          <input type="date" className="border rounded px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="text-left text-gray-500"><th className="py-2 pr-3">Student</th><th className="py-2 pr-3">Status</th></tr></thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="py-2 pr-3">{s.name}</td>
                  <td className="py-2 pr-3">
                    <select className="border rounded px-3 py-1" value={statuses[s.id] || ''} onChange={(e) => setStatuses((prev) => ({ ...prev, [s.id]: e.target.value as any }))}>
                      <option value="">?</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="mt-3 px-4 py-2 rounded bg-blue-600 text-white" onClick={submit}>Save Attendance</button>
      </section>

      <AttendanceList />
    </div>
  );
}

function AttendanceList() {
  const { db, currentUser } = useAppStore();
  const kindergartenId = currentUser?.kindergartenId;
  const branchId = currentUser?.branchId;
  const records = useMemo(() => db.attendance.filter((a) => a.kindergartenId === kindergartenId && (!branchId || a.branchId === branchId)).slice(0, 100), [db.attendance, kindergartenId, branchId]);
  const studentName = (id: string) => db.students.find((s) => s.id === id)?.name || id;
  return (
    <section className="rounded-lg border bg-white p-6">
      <h2 className="font-semibold mb-3">Recent Attendance</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left text-gray-500"><th className="py-2 pr-3">Date</th><th className="py-2 pr-3">Student</th><th className="py-2 pr-3">Status</th></tr></thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-t"><td className="py-2 pr-3">{r.date}</td><td className="py-2 pr-3">{studentName(r.studentId)}</td><td className="py-2 pr-3">{r.status}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
