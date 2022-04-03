import React, { useEffect, useState } from 'react';
import { FormStyled, SpanStyled, FieldStyled } from './FormStyles';
import { Formik, Form, useFormikContext, FormikValues } from 'formik';
import { submittingState } from '../states';
import { useRecoilState } from 'recoil';

import ReactTooltip from 'react-tooltip';

export default function FormComp({
  project,
  langs,
  setLang,
  lang
}: {
  project: string;
  lang: string | null;
  langs: string[];
  setLang: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const initialValues: { key: string; val: string } = { key: '', val: '' };

  const [_, setSending] = useRecoilState(submittingState);
  const [checked, setChecked] = useState<boolean | null>(null);

  const stringWithDots = (e: string) => {
    const splittedString = e.split(' ');
    return splittedString.join('.');
  };

  const AutoSubmitToken = () => {
    const { values } = useFormikContext<FormikValues>();
    useEffect(() => {
      window.addEventListener('keydown', (event) => {
        if (event.key == 'Tab' && checked) {
          return (values.key = stringWithDots(values.key));
        }
      });
    }, [values]);
    return null;
  };

  useEffect(() => {
    if (checked != null) window.Main.send('setAutoFormatDot', checked);
  }, [checked]);

  useEffect(() => {
    window.Main.invoke('getAutoFormatDot').then((arg) => {
      console.log('storedAutoFormatDot', arg);
      setChecked(arg);
    });
  }, []);

  return (
    <FormStyled>
      <span data-tip="When you hit TAB, it will autoformat your key replacing the spaces by dots">
        <label htmlFor="autoFormat">Auto format to dot</label>
        <input
          checked={checked != null ? checked : false}
          id="autoFormat"
          name="autoFormat"
          type="checkbox"
          onChange={() => setChecked(!checked)}
        />
        <ReactTooltip place="top" effect="solid" className="info-span" />
      </span>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          setSending(true);
          const { key, val } = values;
          const obj = Object.fromEntries([[key, val]]);
          window.Main.invoke('save', { data: obj, id: project, lang: lang }).then((res) => {
            if (res) {
              actions.setSubmitting(false);
            } else {
              alert('This key already exists');
            }
            setSending(false);
          });
        }}
      >
        <Form>
          <SpanStyled>
            <div>
              <span>
                <label htmlFor="key">Key</label>
                <FieldStyled id="key" name="key" placeholder="key" type="text" />
              </span>
              <span>
                <label htmlFor="val">Val</label>
                <FieldStyled id="val" name="val" placeholder="val" />
              </span>
            </div>
            <button type="submit">Add</button>
            <AutoSubmitToken />
          </SpanStyled>
        </Form>
      </Formik>
      {langs.map((lang) => (
        <div key={lang} onClick={() => setLang(lang)}>
          {lang}
        </div>
      ))}
    </FormStyled>
  );
}
