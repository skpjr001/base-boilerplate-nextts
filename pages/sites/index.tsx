import React, { Fragment } from 'react'
import Head from 'next/head'

import { useLocale } from '@lib/hooks/useLocale'
import { inferQueryOutput, trpc } from '@lib/trpc';
import Shell from '@components/Shell';
import { QueryCell } from '@lib/QueryCell';
import { Alert } from '@components/ui/Alert';
import Button from '@components/ui/Button';
import { useRouter } from 'next/router';
import { PlusIcon } from '@heroicons/react/solid';



type Profiles = inferQueryOutput<"viewer.websites">["profiles"];

interface CreateEventTypeProps {
  canAddEvents: boolean;
  profiles: Profiles;
}

const CreateFirstEventTypeView = ({ canAddEvents, profiles }: CreateEventTypeProps) => {
  const { t } = useLocale();
  const router = useRouter();


  return (
    <div className="md:py-20">
      {/* <UserCalendarIllustration /> */}
      <div className="block mx-auto text-center md:max-w-screen-sm">
        <h3 className="mt-2 text-xl font-bold text-neutral-900">{t("new_event_type_heading")}</h3>
        <p className="mt-1 mb-2 text-md text-neutral-600">{t("new_event_type_description")}</p>
        {/* <CreateNewEventButton canAddEvents={canAddEvents} profiles={profiles} /> */}
        <Button 
          data-testid="new-event-type"
          {...(canAddEvents
            ? {
              href:"/sites/create"
              }
            : {
              disabled:true
              })}
          StartIcon={PlusIcon}>
          {t("new_event_type_btn")}
        </Button>
      </div>
    </div>
  );
};


const SiteTypesPage = () => {
  const { t } = useLocale();
  const query = trpc.useQuery(["viewer.websites"]);
  
  return (
    <div>
      <Head>
        <title>Home | Cal.com</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Shell
        heading={t("event_types_page_title")}
        subtitle={t("event_types_page_subtitle")}
        CTA={
          query.data &&
          query.data.websites.length !== 0 && (
            <Button 
              data-testid="new-event-type"
              {...(query.data.viewer.canAddEvents
                ? {
                    href:"/sites/create"
                  }
                : {
                    disabled:true
                  })}
              StartIcon={PlusIcon}>
              {t("new_event_type_btn")}
            </Button>
          )
        }
      >
      <QueryCell
        query={query}
        success={({ data }) => (
          <>
            {data.viewer.plan === "FREE" && !data.viewer.canAddEvents && (
              <Alert
                severity="warning"
                title={<>{t("plan_upgrade")}</>}
                message={
                  <>
                    {t("to_upgrade_go_to")}{" "}
                    <a href={"https://cal.com/upgrade"} className="underline">
                      {"https://cal.com/upgrade"}
                    </a>
                  </>
                }
                className="mb-4"
              />
            )}
            {data.websites.map((website) => (
              <Fragment key={website.slug}>
                {/* hide list heading when there is only one (current user) */}
                {(data.websites.length !== 1 || website.teamId) && (
                  <EventTypeListHeading
                    profile={website.profile}
                    membershipCount={website.metadata.membershipCount}
                  />
                )}
                <EventTypeList
                  types={group.eventTypes}
                  profile={group.profile}
                  readOnly={group.metadata.readOnly}
                />
              </Fragment>
            ))}

            {data.websites.length === 0 && (
              <CreateFirstEventTypeView profiles={data.profiles} canAddEvents={data.viewer.canAddEvents} />
            )}
          </>
        )}
      />

      </Shell>

    </div>
  )
}




export default SiteTypesPage
