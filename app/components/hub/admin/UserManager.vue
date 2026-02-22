<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { authClient } from '~/stores/auth'

const toast = useToast()

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')

// ---- TYPES ----
type Org = {
  id: string
  name: string
  slug: string
  logo: string | null
  createdAt: number
  memberCount: number
}

type Project = {
  id: string
  org_id: string
  name: string
  slug: string
  project_avatar: string | null
  description: string | null
  status: string
  public_api_key: string | null
  domain: string | null
  git_repo: string | null
  created_at: number
  updated_at: number
}

type OrgMember = {
  memberId: string
  memberRole: string
  memberCreatedAt: number
  userId: string
  userName: string
  userEmail: string
  userRole: string | null
  userImage: string | null
  userBanned: boolean | null
}

type User = {
  id: string
  name: string
  email: string
  role: string | null
  banned: boolean | null
  image: string | null
  createdAt: number | string
}

type PlatformRole = 'superadmin' | 'admin' | 'user' | 'viewer'

// ---- TABS ----
const activeTab = ref('organizations')

// ---- ORGANIZATIONS ----
const orgs = ref<Org[]>([])
const orgsLoading = ref(false)

async function loadOrgs() {
  orgsLoading.value = true
  try {
    const data = await $fetch<Org[]>('/api/admin/organizations')
    orgs.value = data
  } finally {
    orgsLoading.value = false
  }
}

// ---- ORG DETAIL ----
const selectedOrg = ref<Org | null>(null)
const orgMembers = ref<OrgMember[]>([])
const orgMembersLoading = ref(false)
const orgDetailOpen = ref(false)
const orgDetailTab = ref<'members' | 'projects' | 'api-keys' | 'content-types'>('members')

async function openOrgDetail(org: Org, tab: 'members' | 'projects' | 'api-keys' = 'members') {
  selectedOrg.value = org
  orgDetailOpen.value = true
  orgDetailTab.value = tab
  orgMembersLoading.value = true
  orgProjectsLoading.value = true
  try {
    const [members, projects] = await Promise.all([
      $fetch<OrgMember[]>(`/api/admin/organizations/${org.id}/members`),
      $fetch<Project[]>(`/api/admin/organizations/${org.id}/projects`),
    ])
    orgMembers.value = members
    orgProjects.value = projects
  } finally {
    orgMembersLoading.value = false
    orgProjectsLoading.value = false
  }
}

const addMemberUserId = ref('')
const addMemberRole = ref('member')
const addingMember = ref(false)

const nonMemberUsers = computed(() => {
  const memberIds = new Set(orgMembers.value.map((m) => m.userId))
  return users.value.filter((u) => !memberIds.has(u.id)).map((u) => ({
    label: `${u.name} (${u.email})`,
    value: u.id,
  }))
})

async function addMember() {
  if (!selectedOrg.value || !addMemberUserId.value) return
  addingMember.value = true
  try {
    await $fetch(`/api/admin/organizations/${selectedOrg.value.id}/members`, {
      method: 'POST',
      body: { userId: addMemberUserId.value, role: addMemberRole.value },
    })
    const data = await $fetch<OrgMember[]>(`/api/admin/organizations/${selectedOrg.value.id}/members`)
    orgMembers.value = data
    addMemberUserId.value = ''
    await loadOrgs()
    toast.add({ title: 'Member added', color: 'success' })
  } catch (e: any) {
    toast.add({ title: e?.data?.message || 'Failed to add member', color: 'error' })
  } finally {
    addingMember.value = false
  }
}

async function removeMember(memberId: string) {
  if (!selectedOrg.value) return
  try {
    await $fetch(`/api/admin/organizations/${selectedOrg.value.id}/members/${memberId}`, {
      method: 'DELETE',
    })
    orgMembers.value = orgMembers.value.filter((m) => m.memberId !== memberId)
    await loadOrgs()
    toast.add({ title: 'Member removed', color: 'success' })
  } catch (e: any) {
    toast.add({ title: e?.data?.message || 'Failed to remove member', color: 'error' })
  }
}

// ---- PROJECTS (inside org detail) ----
const orgProjects = ref<Project[]>([])
const orgProjectsLoading = ref(false)

const projectModalOpen = ref(false)
const editingProject = ref<Project | null>(null)
const projectForm = ref({
  name: '',
  slug: '',
  description: '',
  status: 'active',
  domain: '',
  git_repo: '',
})
const projectSaving = ref(false)

const deleteProjectTarget = ref<Project | null>(null)
const confirmDeleteProjectOpen = ref(false)
const deletingProject = ref(false)

watch(
  () => projectForm.value.name,
  (name) => {
    if (!editingProject.value) {
      projectForm.value.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }
  },
)

function openCreateProject() {
  editingProject.value = null
  projectForm.value = { name: '', slug: '', description: '', status: 'active', domain: '', git_repo: '' }
  projectModalOpen.value = true
}

function openEditProject(p: Project) {
  editingProject.value = p
  projectForm.value = {
    name: p.name,
    slug: p.slug,
    description: p.description ?? '',
    status: p.status,
    domain: p.domain ?? '',
    git_repo: p.git_repo ?? '',
  }
  projectModalOpen.value = true
}

async function saveProject() {
  if (!selectedOrg.value) return
  projectSaving.value = true
  try {
    const body = {
      name: projectForm.value.name,
      slug: projectForm.value.slug,
      description: projectForm.value.description || null,
      status: projectForm.value.status,
      domain: projectForm.value.domain || null,
      git_repo: projectForm.value.git_repo || null,
    }
    if (editingProject.value) {
      const updated = await $fetch<Project>(`/api/admin/projects/${editingProject.value.id}`, {
        method: 'PATCH',
        body,
      })
      orgProjects.value = orgProjects.value.map((p) => (p.id === updated.id ? updated : p))
      toast.add({ title: 'Project updated', color: 'success' })
    } else {
      const created = await $fetch<Project>(`/api/admin/organizations/${selectedOrg.value.id}/projects`, {
        method: 'POST',
        body,
      })
      orgProjects.value = [...orgProjects.value, created]
      toast.add({ title: 'Project created', color: 'success' })
    }
    projectModalOpen.value = false
  } catch (e: any) {
    toast.add({ title: e?.data?.message || 'Failed to save project', color: 'error' })
  } finally {
    projectSaving.value = false
  }
}

function requestDeleteProject(p: Project) {
  deleteProjectTarget.value = p
  confirmDeleteProjectOpen.value = true
}

async function confirmDeleteProject() {
  if (!deleteProjectTarget.value) return
  deletingProject.value = true
  try {
    await $fetch(`/api/admin/projects/${deleteProjectTarget.value.id}`, { method: 'DELETE' })
    orgProjects.value = orgProjects.value.filter((p) => p.id !== deleteProjectTarget.value!.id)
    confirmDeleteProjectOpen.value = false
    toast.add({ title: 'Project deleted', color: 'success' })
  } catch (e: any) {
    toast.add({ title: e?.data?.message || 'Failed to delete project', color: 'error' })
  } finally {
    deletingProject.value = false
    deleteProjectTarget.value = null
  }
}

// ---- API KEYS (per project) ----
type ApiKey = {
  id: string
  name: string | null
  start: string | null
  prefix: string | null
  enabled: boolean | null
  expiresAt: number | null
  createdAt: number
  lastRequest: number | null
  requestCount: number | null
  metadata: Record<string, unknown> | null
}

const selectedApiKeyProject = ref<Project | null>(null)
const apiKeys = ref<ApiKey[]>([])
const apiKeysLoading = ref(false)

const newKeyName = ref('')
const newKeyExpiresIn = ref<number | null>(null)
const creatingKey = ref(false)
const newlyCreatedKey = ref<string | null>(null)
const copiedKey = ref(false)
const copiedProjectId = ref<string | null>(null)

const deleteKeyTarget = ref<ApiKey | null>(null)
const confirmDeleteKeyOpen = ref(false)
const deletingKey = ref(false)

async function openApiKeys(p: Project) {
  selectedApiKeyProject.value = p
  apiKeysLoading.value = true
  orgDetailTab.value = 'api-keys'
  try {
    apiKeys.value = await $fetch<ApiKey[]>(`/api/admin/projects/${p.id}/api-keys`)
  } finally {
    apiKeysLoading.value = false
  }
}

async function createKey() {
  if (!selectedApiKeyProject.value) return
  creatingKey.value = true
  try {
    const data = await $fetch<{ key: string } & ApiKey>(`/api/admin/projects/${selectedApiKeyProject.value.id}/api-keys`, {
      method: 'POST',
      body: {
        name: newKeyName.value || `API Key`,
        ...(newKeyExpiresIn.value ? { expiresIn: newKeyExpiresIn.value } : {}),
      },
    })
    // The raw key is only returned on creation
    newlyCreatedKey.value = (data as any).key ?? null
    // Reload list (created key won't have raw key in list)
    apiKeys.value = await $fetch<ApiKey[]>(`/api/admin/projects/${selectedApiKeyProject.value.id}/api-keys`)
    toast.add({ title: 'API key created', color: 'success' })
  } catch (e: any) {
    toast.add({ title: e?.data?.message || 'Failed to create key', color: 'error' })
  } finally {
    creatingKey.value = false
    newKeyName.value = ''
    newKeyExpiresIn.value = null
  }
}

async function copyKey() {
  if (!newlyCreatedKey.value) return
  await navigator.clipboard.writeText(newlyCreatedKey.value)
  copiedKey.value = true
  setTimeout(() => { copiedKey.value = false }, 2000)
}

async function copyProjectId(id: string) {
  await navigator.clipboard.writeText(id)
  copiedProjectId.value = id
  setTimeout(() => { copiedProjectId.value = null }, 2000)
}

function requestDeleteKey(k: ApiKey) {
  deleteKeyTarget.value = k
  confirmDeleteKeyOpen.value = true
}

async function confirmDeleteKey() {
  if (!deleteKeyTarget.value || !selectedApiKeyProject.value) return
  deletingKey.value = true
  try {
    await $fetch(`/api/admin/projects/${selectedApiKeyProject.value.id}/api-keys/${deleteKeyTarget.value.id}`, { method: 'DELETE' })
    apiKeys.value = apiKeys.value.filter((k) => k.id !== deleteKeyTarget.value!.id)
    confirmDeleteKeyOpen.value = false
    toast.add({ title: 'API key deleted', color: 'success' })
  } catch (e: any) {
    toast.add({ title: e?.data?.message || 'Failed to delete key', color: 'error' })
  } finally {
    deletingKey.value = false
    deleteKeyTarget.value = null
  }
}

const expiryOptions = [
  { label: 'Never', value: null },
  { label: '7 days', value: 60 * 60 * 24 * 7 },
  { label: '30 days', value: 60 * 60 * 24 * 30 },
  { label: '90 days', value: 60 * 60 * 24 * 90 },
  { label: '1 year', value: 60 * 60 * 24 * 365 },
]

// ---- CONTENT TYPES (per project) ----
type ContentType = {
  id: string
  project_id: string
  name: string
  slug: string
  description: string | null
  schema: Record<string, unknown>
  created_at: number
}

const selectedContentTypeProject = ref<Project | null>(null)
const contentTypes = ref<ContentType[]>([])
const contentTypesLoading = ref(false)

const contentTypeModalOpen = ref(false)
const editingContentType = ref<ContentType | null>(null)
const contentTypeForm = ref({ name: '', slug: '', description: '', schema: '{}' })
const contentTypeSaving = ref(false)
const deleteContentTypeTarget = ref<ContentType | null>(null)
const confirmDeleteContentTypeOpen = ref(false)
const deletingContentType = ref(false)

async function openContentTypes(p: Project) {
  selectedContentTypeProject.value = p
  contentTypesLoading.value = true
  orgDetailTab.value = 'content-types'
  try {
    contentTypes.value = await $fetch<ContentType[]>(`/api/admin/projects/${p.id}/content-types`)
  } finally {
    contentTypesLoading.value = false
  }
}

function openCreateContentType() {
  editingContentType.value = null
  contentTypeForm.value = { name: '', slug: '', description: '', schema: '{}' }
  contentTypeModalOpen.value = true
}

function openEditContentType(ct: ContentType) {
  editingContentType.value = ct
  contentTypeForm.value = {
    name: ct.name,
    slug: ct.slug,
    description: ct.description ?? '',
    schema: JSON.stringify(ct.schema, null, 2),
  }
  contentTypeModalOpen.value = true
}

async function saveContentType() {
  if (!selectedContentTypeProject.value) return
  contentTypeSaving.value = true
  try {
    let parsedSchema: Record<string, unknown> = {}
    try { parsedSchema = JSON.parse(contentTypeForm.value.schema || '{}') } catch {
      toast.add({ title: 'Invalid JSON in schema field', color: 'error' })
      return
    }
    const body = {
      name: contentTypeForm.value.name,
      slug: contentTypeForm.value.slug,
      description: contentTypeForm.value.description || null,
      schema: parsedSchema,
    }
    if (editingContentType.value) {
      const updated = await $fetch<ContentType>(
        `/api/admin/projects/${selectedContentTypeProject.value.id}/content-types/${editingContentType.value.id}`,
        { method: 'PATCH', body }
      )
      contentTypes.value = contentTypes.value.map(ct => ct.id === updated.id ? updated : ct)
      toast.add({ title: 'Content type updated', color: 'success' })
    } else {
      const created = await $fetch<ContentType>(
        `/api/admin/projects/${selectedContentTypeProject.value.id}/content-types`,
        { method: 'POST', body }
      )
      contentTypes.value = [...contentTypes.value, created]
      toast.add({ title: 'Content type created', color: 'success' })
    }
    contentTypeModalOpen.value = false
  } catch (e: any) {
    toast.add({ title: e?.data?.message || 'Failed to save content type', color: 'error' })
  } finally {
    contentTypeSaving.value = false
  }
}

async function confirmDeleteContentType() {
  if (!deleteContentTypeTarget.value || !selectedContentTypeProject.value) return
  deletingContentType.value = true
  try {
    await $fetch(
      `/api/admin/projects/${selectedContentTypeProject.value.id}/content-types/${deleteContentTypeTarget.value.id}`,
      { method: 'DELETE' }
    )
    contentTypes.value = contentTypes.value.filter(ct => ct.id !== deleteContentTypeTarget.value!.id)
    confirmDeleteContentTypeOpen.value = false
    toast.add({ title: 'Content type deleted', color: 'success' })
  } catch (e: any) {
    toast.add({ title: e?.data?.message || 'Failed to delete content type', color: 'error' })
  } finally {
    deletingContentType.value = false
    deleteContentTypeTarget.value = null
  }
}

const orgModalOpen = ref(false)
const editingOrg = ref<Org | null>(null)
const orgForm = ref({ name: '', slug: '' })
const orgSaving = ref(false)

function openCreateOrg() {
  editingOrg.value = null
  orgForm.value = { name: '', slug: '' }
  orgModalOpen.value = true
}

function openEditOrg(org: Org) {
  editingOrg.value = org
  orgForm.value = { name: org.name, slug: org.slug }
  orgModalOpen.value = true
}

watch(
  () => orgForm.value.name,
  (name) => {
    if (!editingOrg.value) {
      orgForm.value.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }
  },
)

async function saveOrg() {
  orgSaving.value = true
  try {
    if (editingOrg.value) {
      await $fetch(`/api/admin/organizations/${editingOrg.value.id}`, {
        method: 'PATCH',
        body: orgForm.value,
      })
      toast.add({ title: 'Organization updated', color: 'success' })
    } else {
      await $fetch('/api/admin/organizations', { method: 'POST', body: orgForm.value })
      toast.add({ title: 'Organization created', color: 'success' })
    }
    orgModalOpen.value = false
    await loadOrgs()
  } catch (e: any) {
    toast.add({ title: e?.data?.message || 'Failed to save', color: 'error' })
  } finally {
    orgSaving.value = false
  }
}

// ---- DELETE ORG ----
const deleteOrgTarget = ref<Org | null>(null)
const confirmDeleteOrgOpen = ref(false)
const deletingOrg = ref(false)

function requestDeleteOrg(org: Org) {
  deleteOrgTarget.value = org
  confirmDeleteOrgOpen.value = true
}

async function confirmDeleteOrg() {
  if (!deleteOrgTarget.value) return
  deletingOrg.value = true
  try {
    await $fetch(`/api/admin/organizations/${deleteOrgTarget.value.id}`, { method: 'DELETE' })
    confirmDeleteOrgOpen.value = false
    toast.add({ title: 'Organization deleted', color: 'success' })
    await loadOrgs()
  } catch (e: any) {
    toast.add({ title: e?.data?.message || 'Failed to delete', color: 'error' })
  } finally {
    deletingOrg.value = false
    deleteOrgTarget.value = null
  }
}

// ---- USERS ----
const users = ref<User[]>([])
const usersLoading = ref(false)
const userSearch = ref('')
const userTotal = ref(0)

async function loadUsers() {
  usersLoading.value = true
  try {
    const result = await authClient.admin.listUsers({
      query: {
        limit: 200,
        ...(userSearch.value
          ? {
              searchValue: userSearch.value,
              searchField: 'email' as const,
              searchOperator: 'contains' as const,
            }
          : {}),
      },
    })
    users.value = (result.data?.users ?? []) as unknown as User[]
    userTotal.value = result.data?.total ?? 0
  } finally {
    usersLoading.value = false
  }
}

watch(userSearch, useDebounceFn(loadUsers, 300))

// ---- CREATE USER ----
const createUserOpen = ref(false)
const createUserForm = ref({ name: '', email: '', password: '', role: 'user' })
const createUserSaving = ref(false)

async function saveNewUser() {
  createUserSaving.value = true
  try {
    await authClient.admin.createUser({
      name: createUserForm.value.name,
      email: createUserForm.value.email,
      password: createUserForm.value.password,
      role: createUserForm.value.role as PlatformRole,
    })
    createUserOpen.value = false
    createUserForm.value = { name: '', email: '', password: '', role: 'user' }
    toast.add({ title: 'User created', color: 'success' })
    await loadUsers()
  } catch (e: any) {
    toast.add({ title: e?.message || 'Failed to create user', color: 'error' })
  } finally {
    createUserSaving.value = false
  }
}

// ---- EDIT USER ROLE ----
const editRoleOpen = ref(false)
const editRoleUser = ref<User | null>(null)
const editRoleValue = ref('user')
const editRoleSaving = ref(false)

function openEditRole(u: User) {
  editRoleUser.value = u
  editRoleValue.value = u.role ?? 'user'
  editRoleOpen.value = true
}

async function saveRole() {
  if (!editRoleUser.value) return
  editRoleSaving.value = true
  try {
    await authClient.admin.setRole({ userId: editRoleUser.value.id, role: editRoleValue.value as PlatformRole })
    editRoleOpen.value = false
    toast.add({ title: 'Role updated', color: 'success' })
    await loadUsers()
  } catch (e: any) {
    toast.add({ title: e?.message || 'Failed to update role', color: 'error' })
  } finally {
    editRoleSaving.value = false
  }
}

// ---- BAN / UNBAN ----
const banUserOpen = ref(false)
const banTarget = ref<User | null>(null)
const banReason = ref('')
const banSaving = ref(false)

function openBan(u: User) {
  banTarget.value = u
  banReason.value = ''
  banUserOpen.value = true
}

async function confirmBan() {
  if (!banTarget.value) return
  banSaving.value = true
  try {
    await authClient.admin.banUser({
      userId: banTarget.value.id,
      banReason: banReason.value || undefined,
    })
    banUserOpen.value = false
    toast.add({ title: 'User banned', color: 'warning' })
    await loadUsers()
  } catch (e: any) {
    toast.add({ title: e?.message || 'Failed to ban user', color: 'error' })
  } finally {
    banSaving.value = false
  }
}

async function unban(userId: string) {
  try {
    await authClient.admin.unbanUser({ userId })
    toast.add({ title: 'User unbanned', color: 'success' })
    await loadUsers()
  } catch (e: any) {
    toast.add({ title: e?.message || 'Failed to unban user', color: 'error' })
  }
}

// ---- DELETE USER ----
const deleteUserTarget = ref<User | null>(null)
const confirmDeleteUserOpen = ref(false)
const deletingUser = ref(false)

function requestDeleteUser(u: User) {
  deleteUserTarget.value = u
  confirmDeleteUserOpen.value = true
}

async function confirmDeleteUser() {
  if (!deleteUserTarget.value) return
  deletingUser.value = true
  try {
    await authClient.admin.removeUser({ userId: deleteUserTarget.value.id })
    confirmDeleteUserOpen.value = false
    toast.add({ title: 'User deleted', color: 'success' })
    await loadUsers()
  } catch (e: any) {
    toast.add({ title: e?.message || 'Failed to delete user', color: 'error' })
  } finally {
    deletingUser.value = false
    deleteUserTarget.value = null
  }
}

// ---- TABLE COLUMNS ----
const roleColor: Record<string, 'error' | 'warning' | 'success' | 'neutral' | 'info' | 'primary'> = {
  superadmin: 'error',
  admin: 'warning',
  user: 'neutral',
  viewer: 'info',
}

const orgColumns: TableColumn<Org>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-2' }, [
        h(UAvatar, {
          src: row.original.logo ?? undefined,
          alt: row.original.name,
          size: 'xs',
          icon: 'i-lucide-building-2',
        }),
        h('span', { class: 'font-medium' }, row.original.name),
      ]),
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => h('code', { class: 'text-xs text-muted bg-muted/40 px-1.5 py-0.5 rounded' }, row.original.slug),
  },
  {
    accessorKey: 'memberCount',
    header: 'Members',
    meta: { class: { th: 'w-28 text-center', td: 'w-28 text-center' } },
    cell: ({ row }) =>
      h(UBadge, { variant: 'subtle', color: 'neutral' }, () => `${row.original.memberCount} members`),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    meta: { class: { th: 'w-40 text-right', td: 'w-40 text-right' } },
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
  },
  {
    id: 'actions',
    meta: { class: { th: 'w-24 text-right', td: 'w-24 text-right' } },
    cell: ({ row }) =>
      h('div', { class: 'flex gap-1 justify-end' }, [
        h(UButton, {
          icon: 'i-lucide-pencil',
          size: 'xs',
          color: 'neutral',
          variant: 'ghost',
          onClick: (e: Event) => { e.stopPropagation(); openEditOrg(row.original) },
        }),
        h(UButton, {
          icon: 'i-lucide-trash-2',
          size: 'xs',
          color: 'error',
          variant: 'ghost',
          onClick: (e: Event) => { e.stopPropagation(); requestDeleteOrg(row.original) },
        }),
        h(UButton, {
          icon: 'i-lucide-users',
          size: 'xs',
          color: 'primary',
          variant: 'ghost',
          title: 'View members',
          onClick: (e: Event) => { e.stopPropagation(); openOrgDetail(row.original, 'members') },
        }),
        h(UButton, {
          icon: 'i-lucide-folder-open',
          size: 'xs',
          color: 'primary',
          variant: 'ghost',
          title: 'View projects',
          onClick: (e: Event) => { e.stopPropagation(); openOrgDetail(row.original, 'projects') },
        }),
      ]),
  },
]

const userColumns: TableColumn<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-2' }, [
        h(UAvatar, {
          src: row.original.image ?? undefined,
          alt: row.original.name,
          size: 'xs',
          icon: 'i-lucide-user',
        }),
        h('div', { class: 'flex flex-col min-w-0' }, [
          h('span', { class: 'font-medium text-sm truncate' }, row.original.name),
          h('span', { class: 'text-xs text-muted truncate' }, row.original.email),
        ]),
      ]),
  },
  {
    accessorKey: 'role',
    header: 'Platform Role',
    meta: { class: { th: 'w-36', td: 'w-36' } },
    cell: ({ row }) => {
      const role = row.original.role ?? 'user'
      return h(UBadge, { variant: 'subtle', color: roleColor[role] ?? 'neutral', class: 'capitalize' }, () => role)
    },
  },
  {
    accessorKey: 'banned',
    header: 'Status',
    meta: { class: { th: 'w-24 text-center', td: 'w-24 text-center' } },
    cell: ({ row }) =>
      row.original.banned
        ? h(UBadge, { color: 'error', variant: 'subtle' }, () => 'Banned')
        : h(UBadge, { color: 'success', variant: 'subtle' }, () => 'Active'),
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    meta: { class: { th: 'w-40 text-right', td: 'w-40 text-right' } },
    cell: ({ row }) => {
      const ts = row.original.createdAt
      return new Date(typeof ts === 'number' ? ts : ts).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
  },
  {
    id: 'actions',
    meta: { class: { th: 'w-28 text-right', td: 'w-28 text-right' } },
    cell: ({ row }) =>
      h('div', { class: 'flex gap-1 justify-end' }, [
        h(UButton, {
          icon: 'i-lucide-shield',
          size: 'xs',
          color: 'neutral',
          variant: 'ghost',
          title: 'Change role',
          onClick: () => openEditRole(row.original),
        }),
        row.original.banned
          ? h(UButton, {
              icon: 'i-lucide-lock-open',
              size: 'xs',
              color: 'success',
              variant: 'ghost',
              title: 'Unban',
              onClick: () => unban(row.original.id),
            })
          : h(UButton, {
              icon: 'i-lucide-ban',
              size: 'xs',
              color: 'warning',
              variant: 'ghost',
              title: 'Ban',
              onClick: () => openBan(row.original),
            }),
        h(UButton, {
          icon: 'i-lucide-trash-2',
          size: 'xs',
          color: 'error',
          variant: 'ghost',
          title: 'Delete user',
          onClick: () => requestDeleteUser(row.original),
        }),
      ]),
  },
]

const memberColumns: TableColumn<OrgMember>[] = [
  {
    accessorKey: 'userName',
    header: 'User',
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-2' }, [
        h(UAvatar, {
          src: row.original.userImage ?? undefined,
          alt: row.original.userName,
          size: 'xs',
          icon: 'i-lucide-user',
        }),
        h('div', { class: 'flex flex-col min-w-0' }, [
          h('span', { class: 'text-sm font-medium truncate' }, row.original.userName),
          h('span', { class: 'text-xs text-muted truncate' }, row.original.userEmail),
        ]),
      ]),
  },
  {
    accessorKey: 'memberRole',
    header: 'Org Role',
    meta: { class: { th: 'w-28', td: 'w-28' } },
    cell: ({ row }) =>
      h(UBadge, { variant: 'subtle', color: 'neutral', class: 'capitalize' }, () => row.original.memberRole),
  },
  {
    accessorKey: 'userRole',
    header: 'Platform Role',
    meta: { class: { th: 'w-32', td: 'w-32' } },
    cell: ({ row }) => {
      const role = row.original.userRole ?? 'user'
      return h(UBadge, { variant: 'subtle', color: roleColor[role] ?? 'neutral', class: 'capitalize' }, () => role)
    },
  },
  {
    id: 'actions',
    meta: { class: { th: 'w-16 text-right', td: 'w-16 text-right' } },
    cell: ({ row }) =>
      h(UButton, {
        icon: 'i-lucide-user-minus',
        size: 'xs',
        color: 'error',
        variant: 'ghost',
        title: 'Remove from org',
        onClick: () => removeMember(row.original.memberId),
      }),
  },
]

const projectColumns: TableColumn<Project>[] = [
  {
    accessorKey: 'name',
    header: 'Project',
    cell: ({ row }) =>
      h('div', { class: 'flex flex-col min-w-0 gap-0.5' }, [
        h('span', { class: 'font-medium text-sm' }, row.original.name),
        h('code', { class: 'text-xs text-muted' }, row.original.slug),
        h('code', { class: 'text-[10px] text-muted/50 select-all' }, row.original.id),
      ]),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: { class: { th: 'w-28', td: 'w-28' } },
    cell: ({ row }) => {
      const color: Record<string, 'success' | 'neutral' | 'error'> = {
        active: 'success', archived: 'neutral', deleted: 'error',
      }
      return h(UBadge, { variant: 'subtle', color: color[row.original.status] ?? 'neutral', class: 'capitalize' }, () => row.original.status)
    },
  },
  {
    accessorKey: 'domain',
    header: 'Domain',
    meta: { class: { th: 'w-40', td: 'w-40' } },
    cell: ({ row }) =>
      row.original.domain
        ? h('span', { class: 'text-xs text-muted truncate' }, row.original.domain)
        : h('span', { class: 'text-xs text-muted/40' }, '—'),
  },
  {
    id: 'actions',
    meta: { class: { th: 'w-16 text-right', td: 'w-16 text-right' } },
    cell: ({ row }) =>
      h('div', { class: 'flex gap-1 justify-end' }, [
        h(UButton, {
          icon: copiedProjectId.value === row.original.id ? 'i-lucide-check' : 'i-lucide-clipboard',
          size: 'xs',
          color: copiedProjectId.value === row.original.id ? 'success' : 'neutral',
          variant: 'ghost',
          title: 'Copy project ID',
          onClick: () => copyProjectId(row.original.id),
        }),
        h(UButton, {
          icon: 'i-lucide-layers',
          size: 'xs',
          color: 'neutral',
          variant: 'ghost',
          title: 'Manage content types',
          onClick: () => openContentTypes(row.original),
        }),
        h(UButton, {
          icon: 'i-lucide-key',
          size: 'xs',
          color: 'neutral',
          variant: 'ghost',
          title: 'Manage API keys',
          onClick: () => openApiKeys(row.original),
        }),
        h(UButton, {
          icon: 'i-lucide-pencil',
          size: 'xs',
          color: 'neutral',
          variant: 'ghost',
          title: 'Edit project',
          onClick: () => openEditProject(row.original),
        }),
        h(UButton, {
          icon: 'i-lucide-trash-2',
          size: 'xs',
          color: 'error',
          variant: 'ghost',
          title: 'Delete project',
          onClick: () => requestDeleteProject(row.original),
        }),
      ]),
  },
]

// ---- ROLE OPTIONS ----
const platformRoles = [
  { label: 'Viewer', value: 'viewer' },
  { label: 'User', value: 'user' },
  { label: 'Admin', value: 'admin' },
  { label: 'Super Admin', value: 'superadmin' },
]

const orgRoles = [
  { label: 'Member', value: 'member' },
  { label: 'Admin', value: 'admin' },
  { label: 'Owner', value: 'owner' },
]

// ---- INIT ----
onMounted(() => {
  loadOrgs()
  loadUsers()
})
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-default shrink-0">
      <div>
        <h2 class="text-lg font-semibold">User Manager</h2>
        <p class="text-sm text-muted">Manage organizations, members and platform users</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-default shrink-0 px-4">
      <button
        v-for="tab in [
          { value: 'organizations', label: 'Organizations', icon: 'i-lucide-building-2' },
          { value: 'users', label: 'All Users', icon: 'i-lucide-users' },
        ]"
        :key="tab.value"
        class="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors"
        :class="activeTab === tab.value
          ? 'border-primary text-primary'
          : 'border-transparent text-muted hover:text-default'"
        @click="activeTab = tab.value"
      >
        <UIcon :name="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
        <UBadge
          v-if="tab.value === 'organizations'"
          :label="String(orgs.length)"
          variant="subtle"
          color="neutral"
          size="xs"
        />
        <UBadge
          v-if="tab.value === 'users'"
          :label="String(userTotal)"
          variant="subtle"
          color="neutral"
          size="xs"
        />
      </button>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 overflow-auto">
      <!-- Organizations Tab -->
      <div v-if="activeTab === 'organizations'" class="p-6 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-muted">
            {{ orgs.length }} organization{{ orgs.length !== 1 ? 's' : '' }}
          </p>
          <UButton icon="i-lucide-plus" size="sm" label="New Organization" @click="openCreateOrg" />
        </div>

        <div v-if="orgsLoading" class="flex items-center justify-center py-16">
          <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-muted" />
        </div>

        <UTable
          v-else
          :data="orgs"
          :columns="orgColumns"
          class="w-full"
        />
      </div>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'" class="p-6 flex flex-col gap-4">
        <div class="flex items-center justify-between gap-4">
          <UInput
            v-model="userSearch"
            icon="i-lucide-search"
            placeholder="Search by email..."
            class="max-w-xs"
          />
          <UButton icon="i-lucide-user-plus" size="sm" label="New User" @click="createUserOpen = true" />
        </div>

        <div v-if="usersLoading" class="flex items-center justify-center py-16">
          <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-muted" />
        </div>

        <UTable v-else :data="users" :columns="userColumns" class="w-full" />
      </div>
    </div>

    <!-- ===== MODALS ===== -->

    <!-- Org Detail Slideover -->
    <USlideover v-model:open="orgDetailOpen" side="right" :ui="{ content: 'w-[900px] max-w-full' }">
      <template #content>
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-default">
            <div>
              <h3 class="font-semibold text-lg">{{ selectedOrg?.name }}</h3>
              <code class="text-xs text-muted">{{ selectedOrg?.slug }}</code>
            </div>
            <UButton icon="i-lucide-x" variant="ghost" color="neutral" size="sm" @click="orgDetailOpen = false" />
          </div>

          <!-- Sub-tab navigation -->
          <div class="flex gap-1 px-6 pt-3 pb-0 border-b border-default">
            <button
              class="px-3 pb-2 text-sm font-medium transition-colors border-b-2"
              :class="orgDetailTab === 'members' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-default'"
              @click="orgDetailTab = 'members'"
            >
              Members
              <UBadge :label="`${orgMembers.length}`" variant="subtle" color="neutral" class="ml-1.5" />
            </button>
            <button
              class="px-3 pb-2 text-sm font-medium transition-colors border-b-2"
              :class="orgDetailTab === 'projects' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-default'"
              @click="orgDetailTab = 'projects'"
            >
              Projects
              <UBadge :label="`${orgProjects.length}`" variant="subtle" color="neutral" class="ml-1.5" />
            </button>
            <button
              class="px-3 pb-2 text-sm font-medium transition-colors border-b-2"
              :class="orgDetailTab === 'content-types' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-default'"
              @click="orgDetailTab = 'content-types'"
            >
              Content Types
              <UBadge v-if="orgDetailTab === 'content-types' && selectedContentTypeProject" :label="`${contentTypes.length}`" variant="subtle" color="neutral" class="ml-1.5" />
            </button>
          </div>

          <!-- Members panel -->
          <div v-if="orgDetailTab === 'members'" class="flex-1 overflow-auto p-6 flex flex-col gap-4">
            <!-- Add Member -->
            <div class="flex items-center gap-2 p-4 rounded-lg border border-default bg-muted/20">
              <USelect
                v-model="addMemberUserId"
                :items="nonMemberUsers"
                placeholder="Select a user..."
                class="flex-1"
              />
              <USelect
                v-model="addMemberRole"
                :items="orgRoles"
                class="w-32"
              />
              <UButton
                icon="i-lucide-user-plus"
                size="sm"
                :loading="addingMember"
                :disabled="!addMemberUserId"
                @click="addMember"
              />
            </div>

            <div v-if="orgMembersLoading" class="flex items-center justify-center py-8">
              <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin text-muted" />
            </div>
            <div v-else-if="orgMembers.length === 0" class="text-center py-8 text-sm text-muted">
              No members yet
            </div>
            <UTable v-else :data="orgMembers" :columns="memberColumns" class="w-full" />
          </div>

          <!-- Projects panel -->
          <div v-else-if="orgDetailTab === 'projects'" class="flex-1 overflow-auto p-6 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted">Projects owned by this organisation</span>
              <UButton icon="i-lucide-plus" size="xs" label="New Project" @click="openCreateProject" />
            </div>

            <div v-if="orgProjectsLoading" class="flex items-center justify-center py-8">
              <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin text-muted" />
            </div>
            <div v-else-if="orgProjects.length === 0" class="text-center py-8 text-sm text-muted">
              No projects yet
            </div>
            <UTable v-else :data="orgProjects" :columns="projectColumns" class="w-full" />
          </div>

          <!-- API Keys panel -->
          <div v-else-if="orgDetailTab === 'api-keys'" class="flex-1 overflow-auto p-6 flex flex-col gap-4">
            <div class="text-sm text-muted">
              Manage API keys for <strong>{{ selectedApiKeyProject?.name }}</strong>.
              Keys are scoped to this project and can be used with the public content API.
            </div>

            <!-- Create new key inline -->
            <div class="flex flex-col gap-3 p-4 rounded-lg border border-default bg-muted/20">
              <p class="text-xs font-semibold text-muted uppercase tracking-wider">New API Key</p>
              <div class="flex gap-2">
                <UInput v-model="newKeyName" placeholder="Key name (optional)" class="flex-1" size="sm" />
                <USelect
                  v-model="newKeyExpiresIn"
                  :items="expiryOptions"
                  class="w-32"
                  size="sm"
                />
                <UButton
                  icon="i-lucide-plus"
                  size="sm"
                  label="Create"
                  :loading="creatingKey"
                  @click="createKey"
                />
              </div>

              <!-- Newly created key reveal -->
              <div v-if="newlyCreatedKey" class="flex items-center gap-2 p-3 rounded-md bg-success/10 border border-success/30">
                <UIcon name="i-lucide-key" class="w-4 h-4 text-success shrink-0" />
                <code class="flex-1 text-xs break-all">{{ newlyCreatedKey }}</code>
                <UButton
                  :icon="copiedKey ? 'i-lucide-check' : 'i-lucide-copy'"
                  size="xs"
                  variant="ghost"
                  :color="copiedKey ? 'success' : 'neutral'"
                  title="Copy key"
                  @click="copyKey"
                />
                <UButton
                  icon="i-lucide-x"
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  title="Dismiss"
                  @click="newlyCreatedKey = null"
                />
              </div>
              <p v-if="newlyCreatedKey" class="text-xs text-warning">
                Copy this key now — it will not be shown again.
              </p>
            </div>

            <div v-if="apiKeysLoading" class="flex items-center justify-center py-8">
              <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin text-muted" />
            </div>
            <div v-else-if="apiKeys.length === 0" class="text-center py-8 text-sm text-muted">
              No API keys yet
            </div>
            <div v-else class="flex flex-col gap-2">
              <div
                v-for="key in apiKeys"
                :key="key.id"
                class="flex items-center gap-3 p-3 rounded-lg border border-default"
              >
                <UIcon name="i-lucide-key" class="w-4 h-4 text-muted shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium">{{ key.name || 'Unnamed Key' }}</p>
                  <p class="text-xs text-muted">
                    <code>{{ key.prefix }}{{ key.start }}…</code>
                    <span v-if="key.expiresAt" class="ml-2">
                      Expires {{ new Date(key.expiresAt).toLocaleDateString() }}
                    </span>
                    <span v-else class="ml-2">Never expires</span>
                    <span class="ml-2">· {{ key.requestCount ?? 0 }} uses</span>
                  </p>
                </div>
                <UBadge
                  :color="key.enabled ? 'success' : 'neutral'"
                  variant="subtle"
                  :label="key.enabled ? 'Active' : 'Disabled'"
                />
                <UButton
                  icon="i-lucide-trash-2"
                  size="xs"
                  color="error"
                  variant="ghost"
                  title="Revoke key"
                  @click="requestDeleteKey(key)"
                />
              </div>
            </div>
          </div>

          <!-- Content Types panel -->
          <div v-else-if="orgDetailTab === 'content-types'" class="flex-1 overflow-auto p-6 flex flex-col gap-4">
            <div v-if="!selectedContentTypeProject" class="text-center py-8 text-sm text-muted">
              Click the <UIcon name="i-lucide-layers" class="inline w-4 h-4" /> button on a project row to manage its content types.
            </div>
            <template v-else>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium">{{ selectedContentTypeProject.name }}</p>
                  <p class="text-xs text-muted">{{ contentTypes.length }} content type{{ contentTypes.length === 1 ? '' : 's' }}</p>
                </div>
                <UButton icon="i-lucide-plus" size="xs" label="New Content Type" @click="openCreateContentType" />
              </div>

              <div v-if="contentTypesLoading" class="flex items-center justify-center py-8">
                <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin text-muted" />
              </div>
              <div v-else-if="contentTypes.length === 0" class="text-center py-8 text-sm text-muted">
                No content types yet
              </div>
              <div v-else class="flex flex-col gap-2">
                <div
                  v-for="ct in contentTypes"
                  :key="ct.id"
                  class="flex items-start gap-3 p-4 rounded-lg border border-default"
                >
                  <UIcon name="i-lucide-layers" class="w-4 h-4 text-muted shrink-0 mt-0.5" />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium">{{ ct.name }}</p>
                    <p class="text-xs text-muted"><code>{{ ct.slug }}</code></p>
                    <p v-if="ct.description" class="text-xs text-muted mt-0.5">{{ ct.description }}</p>
                    <p class="text-xs text-muted/50 mt-1">
                      {{ Object.keys(ct.schema).length }} schema field{{ Object.keys(ct.schema).length === 1 ? '' : 's' }}
                    </p>
                  </div>
                  <div class="flex gap-1">
                    <UButton
                      icon="i-lucide-pencil"
                      size="xs"
                      color="neutral"
                      variant="ghost"
                      @click="openEditContentType(ct)"
                    />
                    <UButton
                      icon="i-lucide-trash-2"
                      size="xs"
                      color="error"
                      variant="ghost"
                      @click="deleteContentTypeTarget = ct; confirmDeleteContentTypeOpen = true"
                    />
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </USlideover>

    <!-- Create / Edit Content Type -->
    <UModal
      v-model:open="contentTypeModalOpen"
      :title="editingContentType ? 'Edit Content Type' : 'New Content Type'"
      :ui="{ content: 'max-w-xl' }"
    >
      <template #body>
        <div class="flex flex-col gap-4">
          <UFormField label="Name" required>
            <UInput v-model="contentTypeForm.name" placeholder="Blog Post" class="w-full" />
          </UFormField>
          <UFormField label="Slug" required>
            <UInput v-model="contentTypeForm.slug" placeholder="blog-post" class="w-full" />
          </UFormField>
          <UFormField label="Description">
            <UInput v-model="contentTypeForm.description" placeholder="Optional description" class="w-full" />
          </UFormField>
          <UFormField label="Schema (JSON)">
            <UTextarea
              v-model="contentTypeForm.schema"
              :rows="10"
              placeholder='{\n  "fields": []\n}'
              class="w-full font-mono text-xs"
            />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" color="neutral" label="Cancel" @click="contentTypeModalOpen = false" />
          <UButton
            :label="editingContentType ? 'Save Changes' : 'Create'"
            :loading="contentTypeSaving"
            :disabled="!contentTypeForm.name || !contentTypeForm.slug"
            @click="saveContentType"
          />
        </div>
      </template>
    </UModal>

    <!-- Confirm Delete Content Type -->
    <UModal v-model:open="confirmDeleteContentTypeOpen" title="Delete Content Type">
      <template #body>
        <p class="text-sm">
          Are you sure you want to delete <strong>{{ deleteContentTypeTarget?.name }}</strong>?
          All content entries of this type will also be deleted. This cannot be undone.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" color="neutral" label="Cancel" @click="confirmDeleteContentTypeOpen = false" />
          <UButton
            label="Delete"
            color="error"
            :loading="deletingContentType"
            @click="confirmDeleteContentType"
          />
        </div>
      </template>
    </UModal>

    <!-- Create / Edit Org -->
    <UModal v-model:open="orgModalOpen" :title="editingOrg ? 'Edit Organization' : 'New Organization'">
      <template #body>
        <div class="flex flex-col gap-4">
          <UFormField label="Name" required>
            <UInput v-model="orgForm.name" placeholder="My Organization" class="w-full" />
          </UFormField>
          <UFormField label="Slug" required>
            <UInput v-model="orgForm.slug" placeholder="my-organization" class="w-full" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" color="neutral" label="Cancel" @click="orgModalOpen = false" />
          <UButton
            :label="editingOrg ? 'Save Changes' : 'Create'"
            :loading="orgSaving"
            :disabled="!orgForm.name || !orgForm.slug"
            @click="saveOrg"
          />
        </div>
      </template>
    </UModal>

    <!-- Confirm Delete Org -->
    <UModal v-model:open="confirmDeleteOrgOpen" title="Delete Organization">
      <template #body>
        <p class="text-sm">
          Are you sure you want to delete
          <strong>{{ deleteOrgTarget?.name }}</strong>? This will remove all members and cannot be undone.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" color="neutral" label="Cancel" @click="confirmDeleteOrgOpen = false" />
          <UButton color="error" label="Delete" :loading="deletingOrg" @click="confirmDeleteOrg" />
        </div>
      </template>
    </UModal>

    <!-- Create User -->
    <UModal v-model:open="createUserOpen" title="New User">
      <template #body>
        <div class="flex flex-col gap-4">
          <UFormField label="Full Name" required>
            <UInput v-model="createUserForm.name" placeholder="Jane Doe" class="w-full" />
          </UFormField>
          <UFormField label="Email" required>
            <UInput v-model="createUserForm.email" type="email" placeholder="jane@example.com" class="w-full" />
          </UFormField>
          <UFormField label="Password" required>
            <UInput v-model="createUserForm.password" type="password" placeholder="••••••••" class="w-full" />
          </UFormField>
          <UFormField label="Platform Role">
            <USelect v-model="createUserForm.role" :items="platformRoles" class="w-full" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" color="neutral" label="Cancel" @click="createUserOpen = false" />
          <UButton
            label="Create User"
            :loading="createUserSaving"
            :disabled="!createUserForm.name || !createUserForm.email || !createUserForm.password"
            @click="saveNewUser"
          />
        </div>
      </template>
    </UModal>

    <!-- Edit Role -->
    <UModal v-model:open="editRoleOpen" title="Change Platform Role">
      <template #body>
        <div class="flex flex-col gap-4">
          <p class="text-sm text-muted">
            Changing role for <strong>{{ editRoleUser?.name }}</strong> ({{ editRoleUser?.email }})
          </p>
          <UFormField label="Platform Role">
            <USelect v-model="editRoleValue" :items="platformRoles" class="w-full" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" color="neutral" label="Cancel" @click="editRoleOpen = false" />
          <UButton label="Save Role" :loading="editRoleSaving" @click="saveRole" />
        </div>
      </template>
    </UModal>

    <!-- Ban User -->
    <UModal v-model:open="banUserOpen" title="Ban User">
      <template #body>
        <div class="flex flex-col gap-4">
          <p class="text-sm text-muted">
            Ban <strong>{{ banTarget?.name }}</strong> from signing in. You can unban them at any time.
          </p>
          <UFormField label="Reason (optional)">
            <UInput v-model="banReason" placeholder="Describe the reason..." class="w-full" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" color="neutral" label="Cancel" @click="banUserOpen = false" />
          <UButton color="warning" label="Ban User" :loading="banSaving" @click="confirmBan" />
        </div>
      </template>
    </UModal>

    <!-- Confirm Delete User -->
    <UModal v-model:open="confirmDeleteUserOpen" title="Delete User">
      <template #body>
        <p class="text-sm">
          Permanently delete <strong>{{ deleteUserTarget?.name }}</strong> ({{ deleteUserTarget?.email }})?
          This cannot be undone.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" color="neutral" label="Cancel" @click="confirmDeleteUserOpen = false" />
          <UButton color="error" label="Delete User" :loading="deletingUser" @click="confirmDeleteUser" />
        </div>
      </template>
    </UModal>

    <!-- Create / Edit Project -->
    <UModal v-model:open="projectModalOpen" :title="editingProject ? 'Edit Project' : 'New Project'">
      <template #body>
        <div class="flex flex-col gap-4">
          <UFormField label="Name" required>
            <UInput v-model="projectForm.name" placeholder="My Project" class="w-full" />
          </UFormField>
          <UFormField label="Slug" required>
            <UInput v-model="projectForm.slug" placeholder="my-project" class="w-full" />
          </UFormField>
          <UFormField label="Description">
            <UTextarea v-model="projectForm.description" placeholder="Short description…" :rows="3" class="w-full" />
          </UFormField>
          <UFormField label="Status">
            <USelect
              v-model="projectForm.status"
              :items="[
                { label: 'Active', value: 'active' },
                { label: 'Archived', value: 'archived' },
                { label: 'Deleted', value: 'deleted' },
              ]"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Domain">
            <UInput v-model="projectForm.domain" placeholder="myproject.com" class="w-full" />
          </UFormField>
          <UFormField label="Git Repository">
            <UInput v-model="projectForm.git_repo" placeholder="https://github.com/org/repo" class="w-full" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" color="neutral" label="Cancel" @click="projectModalOpen = false" />
          <UButton
            :label="editingProject ? 'Save Changes' : 'Create Project'"
            :loading="projectSaving"
            :disabled="!projectForm.name || !projectForm.slug"
            @click="saveProject"
          />
        </div>
      </template>
    </UModal>

    <!-- Confirm Delete Project -->
    <UModal v-model:open="confirmDeleteProjectOpen" title="Delete Project">
      <template #body>
        <p class="text-sm">
          Permanently delete project <strong>{{ deleteProjectTarget?.name }}</strong>?
          This cannot be undone.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" color="neutral" label="Cancel" @click="confirmDeleteProjectOpen = false" />
          <UButton color="error" label="Delete Project" :loading="deletingProject" @click="confirmDeleteProject" />
        </div>
      </template>
    </UModal>

    <!-- Confirm Revoke API Key -->
    <UModal v-model:open="confirmDeleteKeyOpen" title="Revoke API Key">
      <template #body>
        <p class="text-sm">
          Revoke API key <strong>{{ deleteKeyTarget?.name || 'Unnamed Key' }}</strong>?
          Any services using this key will lose access immediately.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" color="neutral" label="Cancel" @click="confirmDeleteKeyOpen = false" />
          <UButton color="error" label="Revoke Key" :loading="deletingKey" @click="confirmDeleteKey" />
        </div>
      </template>
    </UModal>
  </div>
</template>
