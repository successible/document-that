import React from 'react'
import { FOLDER_PATH_KEY } from '../../../helpers/fs/createFileTree'
import { FileTree, Folder } from '../../../store/store'
import { FileItem } from './FileItem'
import { FolderItem } from './FolderItem'

type props = { fullPath: string[]; fileTree: FileTree | Folder }

export const RecursiveFileTree: React.FC<props> = ({ fileTree, fullPath }) => {
  return (
    <>
      {Object.keys(fileTree)
        .sort((name1, name2) => {
          const tree1 = fileTree[name1]
          const tree2 = fileTree[name2]
          if (typeof tree1 === 'string' && typeof tree2 !== 'string') {
            return 1 // When comparing a file (1) vs. a folder (2), folders go above
          } else if (typeof tree1 !== 'string' && typeof tree2 == 'string') {
            return -1 // When comparing a folder (1) vs. a file (2), folders go above
          } else if (typeof tree1 !== 'string' && typeof tree2 !== 'string') {
            // When comparing two folders, sort them alphabetically
            return String(tree1[FOLDER_PATH_KEY]).localeCompare(
              String(tree2[FOLDER_PATH_KEY])
            )
          } else {
            // When comparing two files, sort them alphabetically
            return String(tree1).localeCompare(String(tree2))
          }
        })
        .map((name) => {
          const value = fileTree[name]
          // value = the name of the file
          if (typeof value === 'string') {
            // In every folder there is a key called ___path, which contains the absolute path of the folder
            // We need to exclude it so that it doesn't appear in the interface
            if (!name.includes('___')) {
              return (
                <FileItem
                  fullPath={[...fullPath, name]}
                  key={name}
                  name={name}
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
