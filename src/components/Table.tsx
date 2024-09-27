import React from 'react';

interface TableProps {
  children: React.ReactNode;
}

export function Table({ children }: TableProps) {
  return (
    <div className="w-full overflow-x-auto my-8">
      <table className="w-full border-collapse bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: TableProps) {
  return (
    <thead className="bg-gray-100 dark:bg-gray-700">
      {children}
    </thead>
  );
}

export function TableBody({ children }: TableProps) {
  return (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
      {children}
    </tbody>
  );
}

export function TableRow({ children }: TableProps) {
  return (
    <tr className="even:bg-gray-50 dark:even:bg-gray-700 odd:bg-white dark:odd:bg-gray-800">
      {children}
    </tr>
  );
}

export function TableHeader({ children }: TableProps) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
      {children}
    </th>
  );
}

export function TableCell({ children }: TableProps) {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
      {children}
    </td>
  );
}
