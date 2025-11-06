"use client";
import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import { sendTelegramMessage } from "@/lib/telegram";

export default function DirectorPage() {
  const store = useAppStore();
  const { currentUser, db } = store;
  const kindergartenId = currentUser?.kindergartenId;

  const branches = useMemo(() => db.branches.filter((b) => b.kindergartenId === kindergartenId), [db.branches, kindergartenId]);
  const teachers = useMemo(() => db.users.filter((u) => u.role === 'teacher' && u.kindergartenId === kindergartenId), [db.users, kindergartenId]);
  const students = useMemo(() => db.students.filter((s) => s.kindergartenId === kindergartenId), [db.students, kindergartenId]);
  const groups = useMemo(() => db.groups.filter((g) => g.kindergartenId === kindergartenId), [db.groups, kindergartenId]);

  const [branchName, setBranchName] = useState("");
  const [branchAddress, setBranchAddress] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherPhone, setTeacherPhone] = useState("");
  const [teacherBranch, setTeacherBranch] = useState("");
  const [studentName, setStudentName] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [monthlyFee, setMonthlyFee] = useState<number | "">("");
  const [studentBranch, setStudentBranch] = useState("");
  const [studentGroup, setStudentGroup] = useState("");
  const [paymentAmount, setPaymentAmount] = useState<number | "">("");
  const [paymentStudent, setPaymentStudent] = useState("");
  const [notifyText, setNotifyText] = useState("");

  if (!currentUser || !kindergartenId) {
    return <div className="text-sm text-red-600">Please login as Director with a kindergarten selected.</div>;
  }

  return (
    <div className="grid gap-8">
      <section className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold mb-3">Branches</h2>
        <div className="grid sm:grid-cols-3 gap-2">
          <input className="border rounded px-3 py-2" placeholder="Branch name" value={branchName} onChange={(e) => setBranchName(e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Address" value={branchAddress} onChange={(e) => setBranchAddress(e.target.value)} />
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => { if (branchName && branchAddress) { store.addBranch(kindergartenId, branchName, branchAddress); setBranchName(''); setBranchAddress(''); } }}>Add Branch</button>
        </div>
        <ul className="mt-3 divide-y">
          {branches.map((b) => (
            <li key={b.id} className="py-2 flex items-center justify-between"><span>{b.name} <span className="text-gray-500">? {b.address}</span></span><button className="text-red-600 text-sm" onClick={() => store.removeBranch(b.id)}>Delete</button></li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold mb-3">Teachers</h2>
        <div className="grid sm:grid-cols-4 gap-2">
          <input className="border rounded px-3 py-2" placeholder="Teacher name" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Phone" value={teacherPhone} onChange={(e) => setTeacherPhone(e.target.value)} />
          <select className="border rounded px-3 py-2" value={teacherBranch} onChange={(e) => setTeacherBranch(e.target.value)}>
            <option value="">No branch</option>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => { if (teacherName) { store.addTeacher(kindergartenId, teacherName, teacherBranch || undefined, teacherPhone || undefined); setTeacherName(''); setTeacherPhone(''); setTeacherBranch(''); } }}>Add Teacher</button>
        </div>
        <ul className="mt-3 divide-y">
          {teachers.map((t) => (
            <li key={t.id} className="py-2 flex items-center justify-between"><span>{t.name} <span className="text-gray-500">{t.phone ? `(${t.phone})` : ''}</span></span><button className="text-red-600 text-sm" onClick={() => store.removeUser(t.id)}>Remove</button></li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold mb-3">Groups</h2>
        <GroupCreator kindergartenId={kindergartenId} />
        <ul className="mt-3 divide-y">
          {groups.map((g) => (
            <li key={g.id} className="py-2 flex items-center justify-between"><span>{g.name}</span></li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold mb-3">Students</h2>
        <div className="grid sm:grid-cols-5 gap-2">
          <input className="border rounded px-3 py-2" placeholder="Student name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Parent name" value={parentName} onChange={(e) => setParentName(e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Parent phone" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} />
          <select className="border rounded px-3 py-2" value={studentBranch} onChange={(e) => setStudentBranch(e.target.value)}>
            <option value="">No branch</option>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select className="border rounded px-3 py-2" value={studentGroup} onChange={(e) => setStudentGroup(e.target.value)}>
            <option value="">No group</option>
            {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <input className="border rounded px-3 py-2" placeholder="Monthly fee" value={monthlyFee} onChange={(e) => setMonthlyFee(Number(e.target.value) || "")} />
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => { if (studentName) { store.addStudent(kindergartenId, studentName, { parentName, parentPhone, monthlyFee: typeof monthlyFee === 'number' ? monthlyFee : undefined, branchId: studentBranch || undefined, groupId: studentGroup || undefined }); setStudentName(''); setParentName(''); setParentPhone(''); setMonthlyFee(''); setStudentBranch(''); setStudentGroup(''); } }}>Add Student</button>
        </div>
        <ul className="mt-3 divide-y">
          {students.map((s) => (
            <li key={s.id} className="py-2 flex items-center justify-between"><span>{s.name} <span className="text-gray-500">{s.parentPhone ? `(${s.parentPhone})` : ''}</span></span><span className={s.balance >= 0 ? 'text-green-600' : 'text-red-600'}>{s.balance}</span></li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold mb-3">Payments</h2>
        <div className="grid sm:grid-cols-4 gap-2 items-center">
          <input className="border rounded px-3 py-2" placeholder="Amount" value={paymentAmount} onChange={(e) => setPaymentAmount(Number(e.target.value) || "")} />
          <select className="border rounded px-3 py-2" value={paymentStudent} onChange={(e) => setPaymentStudent(e.target.value)}>
            <option value="">Select student (optional)</option>
            {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => { if (typeof paymentAmount === 'number') { store.addPayment(kindergartenId, paymentAmount, { studentId: paymentStudent || undefined }); setPaymentAmount(''); setPaymentStudent(''); } }}>Add Payment</button>
        </div>
      </section>

      <section className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold mb-3">Notify via Telegram</h2>
        <div className="flex gap-2">
          <input className="border rounded px-3 py-2 flex-1" placeholder="Message to parents/teachers" value={notifyText} onChange={(e) => setNotifyText(e.target.value)} />
          <button className="px-4 py-2 rounded border" onClick={async () => { const res = await sendTelegramMessage(notifyText); alert(res.ok ? 'Sent' : `Failed: ${res.error}`); }}>Send</button>
        </div>
      </section>
    </div>
  );
}

function GroupCreator({ kindergartenId }: { kindergartenId: string }) {
  const store = useAppStore();
  const [name, setName] = useState("");
  const [minAge, setMinAge] = useState<number | "">("");
  const [maxAge, setMaxAge] = useState<number | "">("");
  const [branchId, setBranchId] = useState("");
  const branches = store.db.branches.filter((b) => b.kindergartenId === kindergartenId);
  return (
    <div className="grid sm:grid-cols-5 gap-2">
      <input className="border rounded px-3 py-2" placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="border rounded px-3 py-2" placeholder="Min age" value={minAge} onChange={(e) => setMinAge(Number(e.target.value) || "")} />
      <input className="border rounded px-3 py-2" placeholder="Max age" value={maxAge} onChange={(e) => setMaxAge(Number(e.target.value) || "")} />
      <select className="border rounded px-3 py-2" value={branchId} onChange={(e) => setBranchId(e.target.value)}>
        <option value="">No branch</option>
        {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>
      <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => { if (name) { store.addGroup(kindergartenId, name, { minAge: typeof minAge === 'number' ? minAge : undefined, maxAge: typeof maxAge === 'number' ? maxAge : undefined, branchId: branchId || undefined }); setName(''); setMinAge(''); setMaxAge(''); setBranchId(''); } }}>Add Group</button>
    </div>
  );
}
