import { Divider, IconButton, Tooltip } from "@mui/joy";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { showCommonDialog } from "@/components/Dialog/CommonDialog";
import Empty from "@/components/Empty";
import Icon from "@/components/Icon";
import MobileHeader from "@/components/MobileHeader";
import ResourceIcon from "@/components/ResourceIcon";
import { resourceServiceClient } from "@/grpcweb";
import useLoading from "@/hooks/useLoading";
import { Resource } from "@/types/proto/api/v2/resource_service";
import { useTranslate } from "@/utils/i18n";

const fetchAllResources = async () => {
  const { resources } = await resourceServiceClient.listResources({});
  return resources;
};

function groupResourcesByDate(resources: Resource[]) {
  const grouped = new Map<number, Resource[]>();
  resources.forEach((item) => {
    const date = new Date(item.createdTs as any);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const timestamp = Date.UTC(year, month - 1, 1);
    if (!grouped.has(timestamp)) {
      grouped.set(timestamp, []);
    }
    grouped.get(timestamp)?.push(item);
  });
  return grouped;
}

const Resources = () => {
  const t = useTranslate();
  const loadingState = useLoading();
  const [resources, setResources] = useState<Resource[]>([]);
  const groupedResources = groupResourcesByDate(resources.filter((resoure) => resoure.memoId));
  const unusedResources = resources.filter((resoure) => !resoure.memoId);

  useEffect(() => {
    fetchAllResources().then((resources) => {
      setResources(resources);
      loadingState.setFinish();
    });
  }, []);

  const handleDeleteUnusedResources = () => {
    showCommonDialog({
      title: "Delete all unused resources",
      content: "Are you sure to delete all unused resources? This action cannot be undone.",
      style: "warning",
      dialogName: "delete-unused-resources-dialog",
      onConfirm: async () => {
        for (const resource of unusedResources) {
          await resourceServiceClient.deleteResource({ id: resource.id });
        }
        setResources(resources.filter((resoure) => resoure.memoId));
      },
    });
  };

  return (
    <section className="w-full max-w-3xl min-h-full flex flex-col justify-start items-center px-4 sm:px-2 sm:pt-4 pb-8 bg-zinc-100 dark:bg-zinc-800">
      <MobileHeader showSearch={false} />
      <div className="w-full flex flex-col justify-start items-start px-4 py-3 rounded-xl bg-white dark:bg-zinc-700 text-black dark:text-gray-300">
        <div className="relative w-full flex flex-row justify-between items-center">
          <p className="px-2 py-1 flex flex-row justify-start items-center select-none rounded opacity-80">
            <Icon.Paperclip className="w-5 h-auto mr-1" /> {t("common.resources")}
          </p>
        </div>
        <div className="w-full flex flex-col justify-start items-start mt-4 mb-6">
          {loadingState.isLoading ? (
            <div className="w-full h-32 flex flex-col justify-center items-center">
              <p className="w-full text-center text-base my-6 mt-8">{t("resource.fetching-data")}</p>
            </div>
          ) : (
            <>
              {resources.length === 0 ? (
                <div className="w-full mt-8 mb-8 flex flex-col justify-center items-center italic">
                  <Empty />
                  <p className="mt-4 text-gray-600 dark:text-gray-400">{t("message.no-data")}</p>
                </div>
              ) : (
                <div className={"w-full h-auto px-2 flex flex-col justify-start items-start gap-y-8"}>
                  {Array.from(groupedResources.entries()).map(([timestamp, resources]) => {
                    const date = new Date(timestamp);
                    return (
                      <div key={timestamp} className="w-full flex flex-row justify-start items-start">
                        <div className="w-16 sm:w-24 pt-4 sm:pl-4 flex flex-col justify-start items-start">
                          <span className="text-sm opacity-60">{date.getFullYear()}</span>
                          <span className="font-medium text-xl">{date.toLocaleString("default", { month: "short" })}</span>
                        </div>
                        <div className="w-full max-w-[calc(100%-4rem)] sm:max-w-[calc(100%-6rem)] flex flex-row justify-start items-start gap-4 flex-wrap">
                          {resources.map((resource) => {
                            return (
                              <div key={resource.id} className="w-24 sm:w-32 h-auto flex flex-col justify-start items-start">
                                <div className="w-24 h-24 flex justify-center items-center sm:w-32 sm:h-32 border dark:border-zinc-900 overflow-clip rounded cursor-pointer hover:shadow hover:opacity-80">
                                  <ResourceIcon resource={resource} strokeWidth={0.5} />
                                </div>
                                <div className="w-full max-w-full flex flex-row justify-between items-center mt-1 px-1">
                                  <p className="text-xs shrink text-gray-400 truncate">{resource.filename}</p>
                                  <Link
                                    className="shrink-0 text-xs ml-1 text-gray-400 hover:underline hover:text-blue-600"
                                    to={`/m/${resource.memoId}`}
                                    target="_blank"
                                  >
                                    #{resource.memoId}
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {unusedResources.length > 0 && (
                    <>
                      <Divider />
                      <div className="w-full flex flex-row justify-start items-start">
                        <div className="w-16 sm:w-24 sm:pl-4 flex flex-col justify-start items-start"></div>
                        <div className="w-full max-w-[calc(100%-4rem)] sm:max-w-[calc(100%-6rem)] flex flex-row justify-start items-start gap-4 flex-wrap">
                          <div className="w-full flex flex-row justify-start items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-400">Unused resources</span>
                            <span className="text-gray-500 dark:text-gray-500 opacity-80">({unusedResources.length})</span>
                            <Tooltip title="Delete all" placement="top">
                              <IconButton size="sm" onClick={handleDeleteUnusedResources}>
                                <Icon.Trash className="w-4 h-auto opacity-60" />
                              </IconButton>
                            </Tooltip>
                          </div>
                          {unusedResources.map((resource) => {
                            return (
                              <div key={resource.id} className="w-24 sm:w-32 h-auto flex flex-col justify-start items-start">
                                <div className="w-24 h-24 flex justify-center items-center sm:w-32 sm:h-32 border dark:border-zinc-900 overflow-clip rounded cursor-pointer hover:shadow hover:opacity-80">
                                  <ResourceIcon resource={resource} strokeWidth={0.5} />
                                </div>
                                <div className="w-full max-w-full flex flex-row justify-between items-center mt-1 px-1">
                                  <p className="text-xs shrink text-gray-400 truncate">{resource.filename}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Resources;
