"use client";

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { SiteHeader } from "@/components/ui/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Shadcn UI Table components


export default function Page() {
  const [activeForm, setActiveForm] = useState("create")

  const renderProfileSection = () => {
    switch (activeForm) {
      case "create":
        return <CreateUserForm />
      case "update":
        return <UpdateUserForm />
      case "delete":
        return <DeleteUserForm />
      default:
        return <CreateUserForm />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar role="admin" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold">Welcome Back Admin</h1>
              </div>

              <div className="px-4 lg:px-6">
                <div className="container py-6">
                  <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
                    <div className="hidden space-y-6 p-10 pb-16 md:block">
                      <div className="space-y-0.5">
                        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                        <p className="text-muted-foreground">
                          Manage users information, create and update new users.
                        </p>
                      </div>

                      <div className="shrink-0 bg-border h-[1px] w-full my-6" />

                      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                        <aside className="-mx-4 lg:w-1/5">
                          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                            <button
                              onClick={() => setActiveForm("create")}
                              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 transition-colors hover:text-accent-foreground hover:underline ${
                                activeForm === "create" ? "bg-accent" : ""
                              }`}
                            >
                              Create new user
                            </button>
                            <button
                              onClick={() => setActiveForm("update")}
                              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 transition-colors hover:text-accent-foreground hover:underline ${
                                activeForm === "update" ? "bg-accent" : ""
                              }`}
                            >
                              Update user
                            </button>
                            <button
                              onClick={() => setActiveForm("delete")}
                              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 transition-colors hover:text-accent-foreground hover:underline ${
                                activeForm === "delete" ? "bg-accent" : ""
                              }`}
                            >
                              Delete user
                            </button>
                          </nav>
                        </aside>

                        <div className="flex-1 lg:max-w-2xl space-y-6">
                          {renderProfileSection()}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export function CreateUserForm() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const [alert, setAlert] = useState({ open: false, message: "", type: "success" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '');
  
    if (digitsOnly.length <= 10) {
      setForm({ ...form, phone: digitsOnly });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8800/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setAlert({ open: true, message: "User registered successfully!", type: "success" });
        setForm({
          name: "",
          username: "",
          email: "",
          phone: "",
          password: "",
          role: "",
        });
      } else {
        setAlert({ open: true, message: data.message || "Something went wrong", type: "error" });
      }
    } catch (error) {
      setAlert({ open: true, message: "Network error", type: "error" });
      console.error(error);
    }
  };
  

  return (
    <>
      <h3 className="text-lg font-medium">Create User</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <Input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <Input
  name="phone"
  placeholder="Phone (10 digits only)"
  value={form.phone}
  onChange={handlePhoneChange}
  required
/>

        <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange} className="w-full border px-3 py-2 rounded-md" required>
          <option value="" disabled hidden>Role</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="inspector">Inspector</option>
        </select>
        <Button type="submit" className="px-4 py-2">Create</Button>
      </form>

      {/* ✅ Alert Dialog */}
      <AlertDialog open={alert.open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alert.type === "success" ? "Success" : "Error"}</AlertDialogTitle>
            <AlertDialogDescription>{alert.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlert({ ...alert, open: false })}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  password: string;
};


export function UpdateUserForm() {
  const [form, setForm] = useState({
    id: '',
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    role: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [dialog, setDialog] = useState({ open: false, message: "", type: "success" });

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("http://localhost:8800/users");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to fetch users");
        setUsers(json);
      } catch (err) {
        console.error("Error loading users:", err);
      }
    }
    loadUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8800/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setDialog({ open: true, message: data.message || "User updated successfully!", type: "success" });
        setForm({ id: '', name: '', username: '', email: '', phone: '', password: '', role: '' });
      } else {
        setDialog({ open: true, message: data.message || "Update failed", type: "error" });
      }
    } catch (error) {
      setDialog({ open: true, message: "Network error", type: "error" });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '');
  
    if (digitsOnly.length <= 10) {
      setForm({ ...form, phone: digitsOnly });
    }
  };
  
  

  return (
    <>
      <h3 className="text-lg font-medium">Update User</h3>

      <input
        placeholder="Search User"
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full border px-3 py-2 rounded-md my-4"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Password</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created_At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users
            .filter(u =>
              u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
              u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              String(u.id).includes(searchTerm)
            )
            .map(u => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phone || '-'}</TableCell>
                <TableCell>{u.password || '-'}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{(u as any).created_at || '-'}</TableCell>
                <TableCell>
                  <Button onClick={() => setForm({ ...u })}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <Input name="id" value={form.id} readOnly className="bg-gray-100 cursor-not-allowed" />
        <Input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" />
        <Input name="username" value={form.username} onChange={handleChange} placeholder="Username" />
        <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <Input
  name="phone"
  placeholder="Phone (10 digits only)"
  value={form.phone}
  onChange={handlePhoneChange}
  required
/>

        <Input name="password" type="text" value={form.password} onChange={handleChange} placeholder="Password" />
        <Select value={form.role} onValueChange={(val) => setForm(prev => ({ ...prev, role: val }))}>
          <SelectTrigger id="role" name="role">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Owner">Owner</SelectItem>
              <SelectItem value="Inspector">Inspector</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button type="submit" className="bg-destructive text-white">Update</Button>
      </form>

      {/* Alert Dialog for feedback */}
      <AlertDialog open={dialog.open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialog.type === "success" ? "Success" : "Error"}
            </AlertDialogTitle>
            <AlertDialogDescription>{dialog.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDialog(prev => ({ ...prev, open: false }))}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


export function DeleteUserForm() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [idToDelete, setIdToDelete] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultDialog, setResultDialog] = useState({ open: false, message: "", type: "success" });

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("http://localhost:8800/users");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to fetch users");
        setUsers(json);
      } catch (err) {
        console.error("Error loading users:", err);
      }
    }
    loadUsers();
  }, []);

  const handleDelete = async () => {
    try {
      const res = await fetch('http://localhost:8800/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idToDelete }),
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(users.filter(user => user.id !== idToDelete));
        setIdToDelete('');
        setResultDialog({ open: true, message: data.message || 'User deleted successfully', type: 'success' });
      } else {
        setResultDialog({ open: true, message: data.message || 'Delete failed', type: 'error' });
      }
    } catch (error) {
      console.error("Network error:", error);
      setResultDialog({ open: true, message: 'Network error', type: 'error' });
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <h3 className="text-lg font-medium">Delete User</h3>

      <Input
        placeholder="Search User"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border px-3 py-2 rounded-md my-4"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Password</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created_At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users
            .filter(u =>
              u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
              u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              String(u.id).toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(u => (
              <TableRow
                key={u.id}
                onClick={() => setIdToDelete(u.id)}
                className="cursor-pointer hover:bg-muted"
              >
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phone || '-'}</TableCell>
                <TableCell>{u.password || '-'}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{(u as any).created_at || '-'}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <form onSubmit={(e) => { e.preventDefault(); setConfirmOpen(true); }} className="space-y-4 mt-6">
        <div>
          <Label htmlFor="idToDelete">User ID to delete</Label>
          <Input
            id="idToDelete"
            name="idToDelete"
            value={idToDelete}
            readOnly
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>

        <Button
          type="submit"
          disabled={!idToDelete}
          className="bg-destructive text-white px-4 py-2 rounded-md"
        >
          Delete
        </Button>
      </form>

      {/* Confirm Deletion Dialog */}
      <AlertDialog open={confirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently remove the user with ID <strong>{idToDelete}</strong> from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Yes, Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Result Message Dialog */}
      <AlertDialog open={resultDialog.open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {resultDialog.type === 'success' ? 'Success' : 'Error'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {resultDialog.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setResultDialog(prev => ({ ...prev, open: false }))}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}



