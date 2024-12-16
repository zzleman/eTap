import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TextEditor = ({ id, name, value, onChange, onBlur }) => {
  const handleEditorChange = (content, editor) => {
    onChange({
      target: {
        name: name,
        value: content,
      },
    });
  };

  return (
    <Editor
      apiKey="qzo12pe2kdjj9jn3wr7z0anxcymjyhkoy9sk2706t17c1v3c"
      value={value}
      name={name}
      id={id}
      init={{
        plugins: [
          'anchor',
          'autolink',
          'charmap',
          'codesample',
          'emoticons',
          'image',
          'link',
          'lists',
          'media',
          'searchreplace',
          'table',
          'visualblocks',
          'wordcount',
        ],
        toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
      }}
      onEditorChange={handleEditorChange}
      onBlur={onBlur}
    />
  );
};

export default TextEditor;
