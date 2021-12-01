import { useLocale } from '@lib/hooks/useLocale'
import { trpc } from '@lib/trpc';
import React from 'react'

const SiteTypesPage = () => {
  const { t } = useLocale();
  const query = trpc.useQuery(["viewer.siteTypes"]);
  
  return (
    <div>
      
    </div>
  )
}

export default SiteTypesPage
