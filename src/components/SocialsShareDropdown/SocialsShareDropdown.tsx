'use client'
import { FC, useEffect, useState } from 'react'
import NcDropDown, { NcDropDownItem } from '../NcDropDown/NcDropDown'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import getTrans from '@/utils/getTrans'

export interface Props {
  className?: string
  bgClass?: string
  sizeClass?: string
  itemClass?: string
  href?: string
}
const T = getTrans()

type TDropDownShareItem = 'Facebook' | 'Twitter' | 'Linkedin' | 'Instagram' | 'Pinterest' | 'copylink'

const initActions: NcDropDownItem<TDropDownShareItem>[] = [
  {
    id: 'copylink',
    name: T['Copy link'],
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-3l1.5 1.5 3-3.75" />
</svg>`,
  },
  {
    id: 'Facebook',
    name: 'Facebook',
    href: '#',
    isTargetBlank: true,
    icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 512 512"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/></svg>`
  },
  {
    id: 'Twitter',
    name: 'Twitter',
    href: '#',
    isTargetBlank: true,
    icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 132.74-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.299 27.614-3.573-48.081-9.747-84.143-52.034-84.143-103.001v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.004-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.92-2.599-24.042 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg>`
  },
  {
    id: 'Linkedin',
    name: 'Linkedin',
    href: '#',
    isTargetBlank: true,
    icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 448 512"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg>`
  },
  {
    id: 'Instagram',
    name: 'Instagram',
    href: '#',
    isTargetBlank: true,
    icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9 114.9-51.3 114.9-114.9S287.7 141 224.1 141zm0 186.7c-39.6 0-71.9-32.3-71.9-71.9s32.3-71.9 71.9-71.9 71.9 32.3 71.9 71.9-32.3 71.9-71.9 71.9zm146.4-194.3c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-1.7-35.7-9.9-67.3-36.2-93.6s-57.9-34.5-93.6-36.2c-37-2.1-148-2.1-185 0-35.7 1.7-67.3 9.9-93.6 36.2s-34.5 57.9-36.2 93.6c-2.1 37-2.1 148 0 185 1.7 35.7 9.9 67.3 36.2 93.6s57.9 34.5 93.6 36.2c37 2.1 148 2.1 185 0 35.7-1.7 67.3-9.9 93.6-36.2s34.5-57.9 36.2-93.6c2.1-37 2.1-148 0-185zm-48.5 224c-7.8 19.6-22.9 34.7-42.5 42.5-29.4 11.7-99.2 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.5-42.5-11.7-29.4-9-99.2-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.5-42.5 29.4-11.7 99.2-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.5 42.5 11.7 29.4 9 99.2 9 132.1s2.7 102.7-9 132.1z"/></svg>`
  },
  {
    id: 'Pinterest',
    name: 'Pinterest',
    href: '#',
    isTargetBlank: true,
    icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 496 512"><path d="M248,8C111.033,8,0,119.033,0,256c0,102.865,62.213,190.933,151.482,229.262c-0.71-19.489-0.135-42.849,4.872-63.783c5.354-22.781,34.694-147.667,34.694-147.667s-8.643-17.273-8.643-42.758c0-40.084,23.275-70.032,52.335-70.032c24.704,0,36.641,18.53,36.641,40.681c0,24.779-15.832,61.725-23.991,95.979c-6.825,28.806,14.481,52.284,42.979,52.284c51.604,0,86.368-66.429,86.368-145.038c0-60.147-40.521-105.19-114.117-105.19c-83.054,0-134.908,61.967-134.908,130.989c0,23.876,7.035,40.75,18.054,53.732c5.078,6.074,5.785,8.51,3.944,15.451c-1.321,5.423-4.341,18.025-5.598,23.054c-1.839,7.154-7.781,9.703-14.331,7.061c-39.887-16.031-58.173-58.95-58.173-107.198c0-79.859,67.518-175.588,201.229-175.588c107.514,0,178.506,77.662,178.506,160.835c0,110.414-61.248,193.017-151.278,193.017c-30.163,0-58.504-16.358-68.167-34.922c0,0-16.208,64.204-19.442,76.177c-5.805,21.129-17.156,42.252-27.51,58.521c22.601,6.653,46.513,10.207,71.274,10.207c136.967,0,248-111.033,248-248C496,119.033,384.967,8,248,8Z"/></svg>`
  }
]

const SocialsShareDropdown: FC<Props> = ({
  className = ' ',
  sizeClass = 'h-9 w-9',
  bgClass = 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700',
  itemClass,
  href = '',
}) => {
  // get current link to share
  const [currentLink, setCurrentLink] = useState(href || '')
  const router = useRouter()

  // update current link to share
  useEffect(() => {
    setCurrentLink(window.location.href)
  }, [router])

  const link = currentLink || ''

  const handleClick = (item: NcDropDownItem<TDropDownShareItem>) => {
    if (item.id === 'copylink') {
      navigator.clipboard.writeText(link)
      toast.success(T['Link copied to clipboard'])
      return
    }
  }

  const actions = initActions.map(item => {
    if (item.id === 'Facebook') {
      item.href = `https://www.facebook.com/sharer/sharer.php?u=${link}`
    } else if (item.id === 'Twitter') {
      item.href = `https://twitter.com/intent/tweet?url=${link}`
    } else if (item.id === 'Linkedin') {
      item.href = `https://www.linkedin.com/shareArticle?mini=true&url=${link}`
    } else if (item.id === 'Pinterest') {
      item.href = `https://pinterest.com/pin/create/button/?url=${link}`
    }
    return item
  })

  return (
    <div className={`nc-SocialsShare flex-shrink-0 ${className}`}>
      <NcDropDown
        className={`flex flex-shrink-0 items-center justify-center rounded-full text-neutral-700 focus:outline-none dark:text-neutral-200 ${sizeClass} ${bgClass}`}
        renderTrigger={() => (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M16.44 8.8999C20.04 9.2099 21.51 11.0599 21.51 15.1099V15.2399C21.51 19.7099 19.72 21.4999 15.25 21.4999H8.73998C4.26998 21.4999 2.47998 19.7099 2.47998 15.2399V15.1099C2.47998 11.0899 3.92998 9.2399 7.46998 8.9099"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 15.0001V3.62012"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.35 5.85L12 2.5L8.65002 5.85"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        onClick={handleClick}
        data={actions}
        dropdownItemsClass={itemClass}
      />
    </div>
  )
}

export default SocialsShareDropdown
