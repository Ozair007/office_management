import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUsers, createUser, updateUser, deleteUser } from '@/api/users'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Pencil,
  Trash2,
  Plus,
} from 'lucide-react'
import AddUserDialog from '@/components/dashboard/AddUserDialog'
import EditUserDialog from '@/components/dashboard/EditUserDialog'
import DeleteUserDialog from '@/components/dashboard/DeleteUserDialog'
import { USERS_PER_PAGE } from '@/constants'
import type { User } from '@/types'
import type { CreateUserFormValues, EditUserFormValues } from '@/lib/validations/user'

function Dashboard() {
  const { user: currentUser, signOut } = useAuth()

  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [deletedUserIds, setDeletedUserIds] = useState<Set<number>>(new Set())

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalPages = Math.ceil(total / USERS_PER_PAGE)

  useEffect(() => {
    fetchUsers()
  }, [currentPage])

  async function fetchUsers(deletedIds: Set<number> = deletedUserIds) {
    setIsLoading(true)
    try {
      const skip = (currentPage - 1) * USERS_PER_PAGE
      const response = await getUsers(USERS_PER_PAGE + deletedIds.size, skip)
      const filteredUsers = response.users.filter((u) => !deletedIds.has(u.id))
      setUsers(filteredUsers.slice(0, USERS_PER_PAGE))
      setTotal(response.total - deletedIds.size)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function openEditDialog(user: User) {
    setSelectedUser(user)
    setIsEditOpen(true)
  }

  function openDeleteDialog(user: User) {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  async function handleCreate(data: CreateUserFormValues) {
    setIsSubmitting(true)
    try {
      const newUser = await createUser(data)
      setUsers((prev) => [newUser, ...prev.slice(0, USERS_PER_PAGE - 1)])
      setTotal((prev) => prev + 1)
      setIsCreateOpen(false)
    } catch (error) {
      console.error('Failed to create user:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleUpdate(data: EditUserFormValues) {
    if (!selectedUser) return

    setIsSubmitting(true)
    try {
      const updatedUser = await updateUser(selectedUser.id, data)
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, ...updatedUser } : u
        )
      )
      setIsEditOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Failed to update user:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!selectedUser) return

    setIsSubmitting(true)
    try {
      await deleteUser(selectedUser.id)
      const newDeletedIds = new Set(deletedUserIds).add(selectedUser.id)
      setDeletedUserIds(newDeletedIds)
      setIsDeleteOpen(false)
      setSelectedUser(null)
      await fetchUsers(newDeletedIds)
    } catch (error) {
      console.error('Failed to delete user:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  function getInitials(firstName: string, lastName: string) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-semibold">User Management</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Hello, {currentUser?.firstName}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage users in the platform ({total} total)
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p className="text-muted-foreground">Loading users...</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="w-24 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.image} alt={user.firstName} />
                            <AvatarFallback>
                              {getInitials(user.firstName, user.lastName)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(user)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(user)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(1)}
                      title="First page"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      title="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      title="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      title="Last page"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      <AddUserDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />

      <EditUserDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        user={selectedUser}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
      />

      <DeleteUserDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        user={selectedUser}
        onConfirm={handleDelete}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export default Dashboard
