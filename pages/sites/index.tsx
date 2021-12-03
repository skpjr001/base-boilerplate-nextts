// TODO: replace headlessui with radix-ui
import { Menu, Transition } from "@headlessui/react";
import {
  DotsHorizontalIcon,
  ExternalLinkIcon,
  LinkIcon,
  ArrowDownIcon,
  ChevronDownIcon,
  PlusIcon,
  ArrowUpIcon,
  UsersIcon,
} from "@heroicons/react/solid";
//import { SchedulingType } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useRef, useState, useEffect } from "react";
import { useMutation } from "react-query";

import { QueryCell } from "@lib/QueryCell";
import classNames from "@lib/classNames";
//import { HttpError } from "@lib/core/http/error";
import { useLocale } from "@lib/hooks/useLocale";
//import { useToggleQuery } from "@lib/hooks/useToggleQuery";
//import createEventType from "@lib/mutations/event-types/create-event-type";
import showToast from "@lib/notification";
import { inferQueryOutput, trpc } from "@lib/trpc";
//import { CreateEventType } from "@lib/types/event-type";

import { Dialog, DialogClose, DialogContent } from "@components/Dialog";
import Shell from "@components/Shell";
import { Tooltip } from "@components/Tooltip";
//import EventTypeDescription from "@components/eventtype/EventTypeDescription";
import { Alert } from "@components/ui/Alert";
import Avatar from "@components/ui/Avatar";
//import AvatarGroup from "@components/ui/AvatarGroup";
import Badge from "@components/ui/Badge";
import { Button } from "@components/ui/Button";
import Dropdown, {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/Dropdown";
//import * as RadioArea from "@components/ui/form/radio-area";
//import UserCalendarIllustration from "@components/ui/svg/UserCalendarIllustration";


type Profiles = inferQueryOutput<"viewer.websites">["profiles"];
interface CreateEventTypeProps {
  canAddEvents: boolean;
}

const CreateFirstEventTypeView = ({ canAddEvents }: CreateEventTypeProps) => {
  const { t } = useLocale();

  return (
    <div className="md:py-20">
      {/* <UserCalendarIllustration /> */}
      <div className="block mx-auto text-center md:max-w-screen-sm">
        <h3 className="mt-2 text-xl font-bold text-neutral-900">{t("new_event_type_heading")}</h3>
        <p className="mt-1 mb-2 text-md text-neutral-600">{t("new_event_type_description")}</p>
        {/* <CreateNewEventButton canAddEvents={canAddEvents} profiles={profiles} /> */}
        <Button 
          data-testid="new-website"
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

type WebsiteGroup = inferQueryOutput<"viewer.websites">["websiteGroups"][number];
type Website = WebsiteGroup["websites"][number];
interface WebsiteListProps {
  profile: { slug: string | null}
  sites: Website[];
}

const WebsiteList = ({ sites }: WebsiteListProps): JSX.Element => {
  const { t } = useLocale();

  const utils = trpc.useContext();
  const mutation = trpc.useMutation("viewer.websiteOrder", {
    onError: (err) => {
      console.error(err.message);
    },
    async onSettled() {
      await utils.cancelQuery(["viewer.websites"]);
      await utils.invalidateQueries(["viewer.websites"]);
    },
  });
  const [sortableSites, setSortableSites] = useState(sites);
  useEffect(() => {
    setSortableSites(sites);
  }, [sites]);
  function moveEventType(index: number, increment: 1 | -1) {
    const newList = [...sortableSites];

    const type = sortableSites[index];
    const tmp = sortableSites[index + increment];
    if (tmp) {
      newList[index] = tmp;
      newList[index + increment] = type;
    }
    setSortableSites(newList);
    mutation.mutate({
      ids: newList.map((site) => site.id),
    });
  }

  return (
    <div className="mb-16 -mx-4 overflow-hidden bg-white border border-gray-200 rounded-sm sm:mx-0">
      <ul className="divide-y divide-neutral-200" data-testid="websites">
        {sortableSites.map((site, index) => (
          <li
            key={site.id}
            className={classNames(
              site.$disabled && "opacity-30 cursor-not-allowed pointer-events-none select-none"
            )}
            data-disabled={site.$disabled ? 1 : 0}>
            <div
              className={classNames(
                "hover:bg-neutral-50 flex justify-between items-center ",
                site.$disabled && "pointer-events-none"
              )}>
              <div className="flex items-center justify-between w-full px-4 py-4 group sm:px-6 hover:bg-neutral-50">
                <button
                  className="absolute mb-8 left-1/2 -ml-4 sm:ml-0 sm:left-[19px] border hover:border-transparent text-gray-400 transition-all hover:text-black hover:shadow group-hover:scale-100 scale-0 w-7 h-7 p-1 invisible group-hover:visible bg-white rounded-full"
                  onClick={() => moveEventType(index, -1)}>
                  <ArrowUpIcon />
                </button>
                <button
                  className="absolute mt-8 left-1/2 -ml-4 sm:ml-0 sm:left-[19px] border hover:border-transparent text-gray-400 transition-all hover:text-black hover:shadow group-hover:scale-100 scale-0 w-7 h-7 p-1 invisible group-hover:visible bg-white rounded-full"
                  onClick={() => moveEventType(index, 1)}>
                  <ArrowDownIcon />
                </button>
                <Link href={"/sites/" + site.id}>
                  <a
                    className="flex-grow text-sm truncate"
                    title={`${site.title} ${site.description ? `– ${site.description}` : ""}`}>
                    <div>
                      <span className="font-medium truncate text-neutral-900">{site.title}</span>
                      {site.hidden && (
                        <span className="ml-12 inline items-center px-1.5 py-0.5 rounded-sm text-xs font-medium bg-yellow-100 text-yellow-800">
                          {t("hidden")}
                        </span>
                      )}
                      {site.status && (
                        <span className="ml-2 inline items-center px-1.5 py-0.5 rounded-sm text-xs font-medium bg-gray-100 text-gray-800">
                          {site.status}
                        </span>
                      )}
                    </div>
                    {/* <EventTypeDescription website={site} /> */}
                  </a>
                </Link>

                <div className="flex-shrink-0 hidden mt-4 sm:flex sm:mt-0 sm:ml-5">
                  <div className="flex items-center space-x-2 overflow-hidden">
                    {/* {type.users?.length > 1 && (
                      <AvatarGroup
                        size={8}
                        truncateAfter={4}
                        items={type.users.map((organizer) => ({
                          alt: organizer.name || "",
                          image: organizer.avatar || "",
                        }))}
                      />
                    )} */}
                    <Tooltip content={t("preview")}>
                      <a
                        href={`${process.env.NEXT_PUBLIC_APP_URL}/sites/${site.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-icon">
                        <ExternalLinkIcon className="w-5 h-5 group-hover:text-black" />
                      </a>
                    </Tooltip>

                    <Tooltip content={t("copy_link")}>
                      <button
                        onClick={() => {
                          showToast(t("link_copied"), "success");
                          navigator.clipboard.writeText(
                            `${process.env.NEXT_PUBLIC_APP_URL}/sites/${site.slug}`
                          );
                        }}
                        className="btn-icon">
                        <LinkIcon className="w-5 h-5 group-hover:text-black" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div className="flex flex-shrink-0 mr-5 sm:hidden">
                <Menu as="div" className="inline-block text-left">
                  {({ open }) => (
                    <>
                      <div>
                        <Menu.Button className="p-2 mt-1 border border-transparent text-neutral-400 hover:border-gray-200">
                          <span className="sr-only">{t("open_options")}</span>
                          <DotsHorizontalIcon className="w-5 h-5" aria-hidden="true" />
                        </Menu.Button>
                      </div>

                      <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">
                        <Menu.Items
                          static
                          className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white divide-y rounded-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-neutral-100">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href={`${process.env.NEXT_PUBLIC_APP_URL}/${profile.slug}/${type.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={classNames(
                                    active ? "bg-neutral-100 text-neutral-900" : "text-neutral-700",
                                    "group flex items-center px-4 py-2 text-sm font-medium"
                                  )}>
                                  <ExternalLinkIcon
                                    className="w-4 h-4 mr-3 text-neutral-400 group-hover:text-neutral-500"
                                    aria-hidden="true"
                                  />
                                  {t("preview")}
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => {
                                    showToast("Link copied!", "success");
                                    navigator.clipboard.writeText(
                                      `${process.env.NEXT_PUBLIC_APP_URL}/${profile.slug}/${type.slug}`
                                    );
                                  }}
                                  className={classNames(
                                    active ? "bg-neutral-100 text-neutral-900" : "text-neutral-700",
                                    "group flex items-center px-4 py-2 text-sm w-full font-medium"
                                  )}>
                                  <LinkIcon
                                    className="w-4 h-4 mr-3 text-neutral-400 group-hover:text-neutral-500"
                                    aria-hidden="true"
                                  />
                                  {t("copy_link")}
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface WebsiteListHeadingProps {
  profile: {name:string, image:string};
  websiteCount: number;
}

const WebsiteListHeading = ({ profile,  websiteCount=0 }: WebsiteListHeadingProps): JSX.Element => (
  <div className="flex mb-4">
    <Link href="/settings/teams">
      <a>
        <Avatar
          alt={profile?.name || ""}
          imageSrc={profile?.image || undefined}
          size={8}
          className="inline mt-1 mr-2"
        />
      </a>
    </Link>
    <div>
      <Link href="/settings/teams">
        <a className="font-bold">{profile?.name || ""}</a>
      </Link>
      {websiteCount && (
        <span className="relative ml-2 text-xs text-neutral-500 -top-px">
          <Link href="/settings/teams">
            <a>
              <Badge variant="gray">
                <UsersIcon className="inline w-3 h-3 mr-1 -mt-px" />
                {websiteCount}
              </Badge>
            </a>
          </Link>
        </span>
      )}
      {profile?.slug && (
        <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/${profile.slug}`}>
          <a className="block text-xs text-neutral-500">{`${process.env.NEXT_PUBLIC_APP_URL?.replace(
            "https://",
            ""
          )}/${profile.slug}`}</a>
        </Link>
      )}
    </div>
  </div>
);


const SiteTypesPage = () => {
  const { t } = useLocale();
  const query = trpc.useQuery(["viewer.websites"]);
  console.log(query.data,"sitepage");
  
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
          query.data.viewer.totalWebsiteCount !==0 && (
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
            {data.websiteGroups.map((group) => (
              group.metadata.websiteCount !==0 &&
              <Fragment key={group.profile.name}>
                {/* hide list heading when there is only one (current user) */}
                {(group.websites.length >= 1) && (
                  <WebsiteListHeading
                    profile={{name:group.profile.name,image:"sfsdaf"}}
                    websiteCount={group.metadata.websiteCount}
                  />
                )}
                <WebsiteList
                  sites={group.websites}
                  readOnly={true}
                />
              </Fragment>
            ))}

            {data.viewer.totalWebsiteCount === 0 && (
              <CreateFirstEventTypeView canAddEvents={data.viewer.canAddEvents} />
            )}
          </>
        )}
      />

      </Shell>

    </div>
  )
}




export default SiteTypesPage
