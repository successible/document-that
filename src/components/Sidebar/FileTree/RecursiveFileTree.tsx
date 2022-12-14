import { isObject } from 'lodash'
import React from 'react'
import {
  PATH_KEY,
  WORKDIR_STATUS_KEY,
} from '../../../helpers/fs/createFileTree'
import { File, FileTree, Folder } from '../../../store/store'
import { FileItem } from './FileItem'
import { FolderItem } from './FolderItem'

type props = { fullPath: string[]; fileTree: FileTree }

export const RecursiveFileTree: React.FC<props> = ({ fileTree, fullPath }) => {
  if (!fileTree) return <></>

  return (
    <>
      {Object.keys(fileTree)
        .sort((name1, name2) => {
          const tree1 = fileTree[name1] as Folder | File | string
          const tree2 = fileTree[name2] as Folder | File | string

          // If you recursively go into a Folder or FileMeta, eventually you will hit strings
          // For example, fileTree[name1] where name1 = "expanded"
          // Which means tree1 actually equals "yes" or "no"

          if (!isObject(tree1) || !isObject(tree2)) {
            return -1
          }

          const tree1IsFile = WORKDIR_STATUS_KEY in tree1
          const tree2isFile = WORKDIR_STATUS_KEY in tree2

          if (tree1IsFile && !tree2isFile) {
            return 1 // When comparing a file (1) vs. a folder (2), folders go above
          } else if (!tree1IsFile && tree2isFile) {
            return -1 // When comparing a folder (1) vs. a file (2), folders go above
          } else if (!tree1IsFile && !tree2isFile) {
            // When comparing two folders, sort them alphabetically
            return String(tree1[PATH_KEY]).localeCompare(
              String(tree2[PATH_KEY])
            )
          } else {
            // When comparing two files, sort them alphabetically
            return String(tree1).localeCompare(String(tree2))
          }
        })
        .filter((name) => {
          const value = fileTree[name] as Folder | File | string
          return isObject(value)
        })
        .map((name) => {
          const value = fileTree[name] as Folder | File
          // If WORKDIR_STATUS_KEY exists in the value, it is a file
          if (WORKDIR_STATUS_KEY in value) {
            if (!name.includes('___')) {
              // In every folder there is a key called ___path, which contains the absolute path of the folder
              // We need to exclude it so that it doesn't appear in the interface
              return (
                <FileItem
                  fullPath={[...fullPath, name]}
                  key={name}
                  name={name}
                  file={value as File}
                />
              )
            }
          } else {
            fileTree
            return (
              <FolderItem
                folder={value}
                fullPath={[...fullPath, name]}
                key={name}
                name={name}
              />
            )
          }
        })}
    </>
  )
}
