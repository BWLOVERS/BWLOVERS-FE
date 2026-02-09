import ActionButton from '@/common/components/ActionButton';
import Header from '@/common/components/Header';
import Dropdown from '../components/Dropdown';
import DropdownMenuList from '../components/DropdownMenulist';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jobList from '@/SignUp/data/job_list.json';
import type { SignUpBasicInfoState } from '../types/signupBasicInfo';
import { mergeBasicInfoState } from '../utils/routeState';

type JobNode = {
  label: string;
  children?: JobNode[];
};

const data = jobList as JobNode[];

const getLabels = (nodes?: JobNode[]) =>
  nodes ? nodes.map((n) => n.label) : [];
const findNode = (nodes: JobNode[], label?: string) =>
  label ? nodes.find((n) => n.label === label) : undefined;

export default function JobSelect() {
  const navigate = useNavigate();
  const location = useLocation();

  const incomingState = (location.state as SignUpBasicInfoState | null) ?? null;

  const [openKey, setOpenKey] = useState<
    'major' | 'middle' | 'small' | 'detail' | null
  >(null);

  const [majorValue, setMajorValue] = useState<string | undefined>();
  const [middleValue, setMiddleValue] = useState<string | undefined>();
  const [smallValue, setSmallValue] = useState<string | undefined>();

  // 기존에 직업이 이미 입력돼 있었다면, 세분류 input에 보여주고 싶을 때
  const [detailValue, setDetailValue] = useState<string | undefined>(
    incomingState?.job
  );

  const majorRef = useRef<HTMLDivElement | null>(null);
  const middleRef = useRef<HTMLDivElement | null>(null);
  const smallRef = useRef<HTMLDivElement | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!openKey) return;
      const target = e.target as Node;

      if (
        openKey === 'major' &&
        majorRef.current &&
        !majorRef.current.contains(target)
      ) {
        setOpenKey(null);
        return;
      }
      if (
        openKey === 'middle' &&
        middleRef.current &&
        !middleRef.current.contains(target)
      ) {
        setOpenKey(null);
        return;
      }
      if (
        openKey === 'small' &&
        smallRef.current &&
        !smallRef.current.contains(target)
      ) {
        setOpenKey(null);
        return;
      }
      if (
        openKey === 'detail' &&
        detailRef.current &&
        !detailRef.current.contains(target)
      ) {
        setOpenKey(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openKey]);

  const majorOptions = useMemo(() => getLabels(data), []);

  const majorNode = useMemo(() => findNode(data, majorValue), [majorValue]);
  const middleOptions = useMemo(
    () => getLabels(majorNode?.children),
    [majorNode]
  );

  const middleNode = useMemo(
    () =>
      majorNode?.children
        ? findNode(majorNode.children, middleValue)
        : undefined,
    [majorNode, middleValue]
  );
  const smallOptions = useMemo(
    () => getLabels(middleNode?.children),
    [middleNode]
  );

  const smallNode = useMemo(
    () =>
      middleNode?.children
        ? findNode(middleNode.children, smallValue)
        : undefined,
    [middleNode, smallValue]
  );
  const detailOptions = useMemo(
    () => getLabels(smallNode?.children),
    [smallNode]
  );

  const isCompleteEnabled = Boolean(detailValue);

  const handleComplete = () => {
    if (!detailValue) return;

    navigate('/signup/info', {
      state: mergeBasicInfoState(incomingState, { job: detailValue }),
      replace: true
    });
  };

  return (
    <>
      <Header title="직업 선택" showBack={true} />

      <main className="mx-[3.1rem] mt-28 mb-1.5 flex flex-1 flex-col gap-7">
        {/* 대분류 */}
        <div ref={majorRef} className="relative w-full">
          <Dropdown
            placeholder="대분류"
            value={majorValue}
            isOpen={openKey === 'major'}
            onToggle={(next) => setOpenKey(next ? 'major' : null)}
          />

          {openKey === 'major' && (
            <div className="absolute top-[calc(100%+0.5rem)] left-0 z-50 w-full">
              <DropdownMenuList
                options={majorOptions}
                selectedValue={majorValue}
                onSelect={(v) => {
                  setMajorValue(v);
                  setMiddleValue(undefined);
                  setSmallValue(undefined);
                  setDetailValue(undefined);
                  setOpenKey(null);
                }}
              />
            </div>
          )}
        </div>

        {/* 중분류 */}
        {majorValue && (
          <div ref={middleRef} className="relative w-full">
            <Dropdown
              placeholder="중분류"
              value={middleValue}
              isOpen={openKey === 'middle'}
              onToggle={(next) => setOpenKey(next ? 'middle' : null)}
            />

            {openKey === 'middle' && (
              <div className="absolute top-[calc(100%+0.5rem)] left-0 z-50 w-full">
                <DropdownMenuList
                  options={middleOptions}
                  selectedValue={middleValue}
                  onSelect={(v) => {
                    setMiddleValue(v);
                    setSmallValue(undefined);
                    setDetailValue(undefined);
                    setOpenKey(null);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* 소분류 */}
        {majorValue && middleValue && (
          <div ref={smallRef} className="relative w-full">
            <Dropdown
              placeholder="소분류"
              value={smallValue}
              isOpen={openKey === 'small'}
              onToggle={(next) => setOpenKey(next ? 'small' : null)}
            />

            {openKey === 'small' && (
              <div className="absolute top-[calc(100%+0.5rem)] left-0 z-50 w-full">
                <DropdownMenuList
                  options={smallOptions}
                  selectedValue={smallValue}
                  onSelect={(v) => {
                    setSmallValue(v);
                    setDetailValue(undefined);
                    setOpenKey(null);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* 세분류 */}
        {majorValue && middleValue && smallValue && (
          <div ref={detailRef} className="relative w-full">
            <Dropdown
              placeholder="세분류"
              value={detailValue}
              isOpen={openKey === 'detail'}
              onToggle={(next) => setOpenKey(next ? 'detail' : null)}
            />

            {openKey === 'detail' && (
              <div className="absolute top-[calc(100%+0.5rem)] left-0 z-50 w-full">
                <DropdownMenuList
                  options={detailOptions}
                  selectedValue={detailValue}
                  onSelect={(v) => {
                    setDetailValue(v);
                    setOpenKey(null);
                  }}
                />
              </div>
            )}
          </div>
        )}
      </main>

      <div className="flex w-full justify-end px-11.5 pb-9.75">
        <ActionButton
          label="완료"
          disabled={!isCompleteEnabled}
          onClick={handleComplete}
        />
      </div>
    </>
  );
}
