import FS from '@isomorphic-git/lightning-fs'
import { Octokit } from '@octokit/rest'
import produce from 'immer'
import { GitProgressEvent } from 'isomorphic-git'
import ms from 'ms'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { WritableDraft } from 'immer/dist/internal'
import { getActiveData } from '../helpers/fs/getActiveData'
import { fetchRepos } from '../helpers/github/operations/fetchRepos'
import { Repo, Repos, User } from '../pages'
import { Colors, defaultColors } from '../theme/colors'
import { recalculateData } from './helpers/recalculateData'

// Isomorphic Git Status Types

export type HeadStatus = 0 | 1
// We are mostly interested in WorkdirStatus
// 2 = Created or edited a file
// 1 = Unchanged
// 0 = Deleted a file
export type WorkdirStatus = 0 | 1 | 2
export type StageStatus = 0 | 1 | 2 | 3

export type Folder = { ___path: string; ___expanded: 'yes' | 'no' } & {
  [key: string]: string
}

export type File = {
  ___path: string
  ___headStatus: HeadStatus
  ___workdirStatus: WorkdirStatus
  ___stageStatus: StageStatus
} & {
  [key: string]: string | number
}

export type FileTree = Record<string, Folder | File>

export type FileContent = { path: string; content: string }

export type ActiveData = {
  file: FileContent | null
  files: string[]
  fileTree: FileTree
}
export type Data = Record<string, ActiveData>

export type StoreData = {
  fs: FS | null
  accessToken: string
  colors: Colors
  cloneProgress: GitProgressEvent
  pushProgress: GitProgressEvent
  user: User | null
  repos: Repos
  activeRepo: Repo | null
  activeBranch: string | null
  data: Data
  folderBeingDeleted: string | null
  fileBeingDeleted: string | null
  folderBeingCreated: string | null
  fileBeingCreated: string | null
  openSettings: boolean
  openSidebar: boolean
  openCreateFolder: boolean
  openDeleteFolder: boolean
}

export type Command = {
  type: 'toggle_folder_at_path'
  payload: {
    path: string[]
  }
}

export type StoreMethods = {
  methods: {
    setFS: (fs: FS) => void
    setAccessToken: (accessToken: string) => void
    setColors: (colors: Colors) => void
    setCloneProgress: (progress: GitProgressEvent) => void
    setPushProgress: (progress: GitProgressEvent) => void
    setRepos: (repos: Repos) => void
    setUser: (user: User | null) => void
    setActiveRepo: (activeRepo: Repo | null) => void
    setActiveBranch: (activeBranch: string | null) => void
    setData: (data: Data) => void
    setActiveFile: (file: FileContent | null) => void
    recalculateData: (command?: Command[]) => void
    setFolderBeingDeleted: (path: string | null) => void
    setFileBeingDeleted: (path: string | null) => void
    setFolderBeingCreated: (path: string | null) => void
    setFileBeingCreated: (path: string | null) => void
    setOpenSettings: (status: boolean) => void
    setOpenSidebar: (status: boolean) => void
    setOpenCreateFolder: (status: boolean) => void
    setOpenDeleteFolder: (status: boolean) => void
    refreshRepos: () => Promise<void>
    resetRepo: () => Promise<void>
    resetStore: () => void
  }
}

export type Methods = StoreMethods['methods']

export type State = StoreData & StoreMethods

export type Set = (
  nextStateOrUpdater:
    | State
    | Partial<State>
    | ((state: WritableDraft<State>) => void),
  shouldReplace?: boolean | undefined
) => void

export const defaultActiveData = {
  file: null,
  files: [],
  fileTree: {},
} as ActiveData

const initialState: StoreData = {
  accessToken: '',
  activeBranch: null,
  activeRepo: null,
  cloneProgress: {} as GitProgressEvent,
  colors: defaultColors,
  data: {} as Data,
  fileBeingCreated: null,
  fileBeingDeleted: null,
  folderBeingCreated: null,
  folderBeingDeleted: null,
  fs: null,
  openCreateFolder: false,
  openDeleteFolder: false,
  openSettings: false,
  openSidebar: false,
  pushProgress: {} as GitProgressEvent,
  repos: [] as Repos,
  user: null,
}

export const useStore = create<State>()(
  persist(
    immer((set, get) => ({
      ...initialState,
      methods: {
        recalculateData: async (command) =>
          await recalculateData(get, set, command),

        refreshRepos: async () => {
          const octokit = new Octokit({ auth: get().accessToken })
          const repos = await fetchRepos(octokit)
          set({ repos })
        },

        resetRepo: async () => {
          const octokit = new Octokit({ auth: get().accessToken })
          const repos = await fetchRepos(octokit)
          // This ensures that it refresh the list of repo
          // Once the GitHub API returns the fact the repo is deleted
          // Basically, the GitHub API is a bit delayed
          setTimeout(() => {
            get().methods.refreshRepos()
            console.log('List of repositories refreshed')
          }, ms('1 minute'))

          // Remove the data associated with the repo from all the data
          const activeRepo = get().activeRepo
          const data = produce(get().data, (draft) => {
            delete draft[activeRepo?.full_name || '']
          })

          return set(() => ({
            activeBranch: null,
            activeFile: null,
            activeRepo: null,
            cloneProgress: {},
            data,
            repos: repos,
          }))
        },

        resetStore: () => set({ ...initialState }),
        setAccessToken: (accessToken) => set({ accessToken: accessToken }),
        setActiveBranch: (activeBranch) => set({ activeBranch }),
        setActiveFile: (activeFile) => {
          const activeRepo = get().activeRepo
          const data = get().data
          if (!activeRepo) return
          const newData = produce(data, (draft) => {
            getActiveData(activeRepo, draft).file = activeFile
          })
          return set({ data: newData })
        },
        setActiveRepo: (activeRepo) => set({ activeRepo }),
        setCloneProgress: (cloneProgress) => set({ cloneProgress }),
        setColors: (colors) => set({ colors }),
        setData: (data) => set({ data }),
        setFileBeingCreated: (path) => set({ fileBeingCreated: path }),
        setFileBeingDeleted: (path) => set({ fileBeingDeleted: path }),
        setFolderBeingCreated: (path) => set({ folderBeingCreated: path }),
        setFolderBeingDeleted: (path) => set({ folderBeingDeleted: path }),
        setFS: (fs) => set({ fs }),
        setOpenCreateFolder: (status) => set({ openCreateFolder: status }),
        setOpenDeleteFolder: (status) => set({ openDeleteFolder: status }),
        setOpenSettings: (status) => set({ openSettings: status }),
        setOpenSidebar: (status) => set({ openSidebar: status }),
        setPushProgress: (pushProgress) => set({ pushProgress }),
        setRepos: (repos) => set({ repos }),
        setUser: (user) => set({ user }),
      },
    })),
    {
      getStorage: () => window.localStorage,
      name: 'data',
      // https://github.com/pmndrs/zustand/wiki/Persisting-the-store's-data#partialize
      // We only want to keep a few values in localStorage
      // If you keep the sidebar, for example, the first render of the client will show the sidebar
      // Causing an SSR mismatch between the client and server
      partialize: (state) => ({
        accessToken: state.accessToken,
        activeBranch: state.activeBranch,
        activeRepo: state.activeRepo,
        data: state.data,
        repos: state.repos,
        user: state.user,
      }),
    }
  )
)
