import * as React from 'react';

export const BritishSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width={21}
      height={15}
      fill='none'
    >
      <path
        fill='url(#a)'
        d='M0 .5h20.588v14H0z'
      />
      <defs>
        <pattern
          id='a'
          width={1}
          height={1}
          patternContentUnits='objectBoundingBox'
        >
          <use
            xlinkHref='#b'
            transform='matrix(.0625 0 0 .09191 0 -.006)'
          />
        </pattern>
        <image
          xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAB/ElEQVQokXWNX0iTURiH3/OxgpgQTiPBphjOXOGgYBq0ZazaKEKJmBBu1Ewc0kXdBO1CzAZRGgYSyWCNbsRFi4hQ6mKDNsJGUlP8N9kwjJrSVvZnfvvOd855u6grod/Fc/FcPD8yEog1WEyJ+PJ6HgA4F/y6q2nu1n3kvKnvytXhJKpScbOkN+ywpSZXznRodDvLHJmY3evMfipOfchxJIY6XcNBLVAF63SnmvUq45YDFeZ4ACKDIxOLUiwjR6tOkPFw/ceku70+l1MIAZjJwmyGEFgtoHdbxpQIk2v+R0/Td26+lQDgc+57f960yvdy/w1f734AAPkXyDIADK2Mau2W9Nku2+nw3NLPkqJAOlsQArfO6cS2ti1OCJxeWCcRT9+5Q1qYyYCqAqX/KAQqCqMUKRWqKigFzjWN1Xenf//nwWplzYf/dhGRc844UxlLzq9JPQNvhkOpTu+r+YUN+Fag3RcBAIsyKgoAAOCX47Z48OWemtD57hctR/1SqcR2V2wfCzhqI/d+PAxdKvcCgFAUpBQQjxwbr4zGzGQtdTJuMteCYJLLbehsbyzd9s22ugc2W3RlHBGIsZoYqxBRv0/nuhBJGK27gsHed/2XPVZN7mvhgb3nmaH1/dhrlcmMc0+HYXJqAxlzLOYfP4+C4E8m4pU15b6hwWXf6B8n9UIe/YS4rgAAAABJRU5ErkJggg=='
          id='b'
          width={16}
          height={11}
          preserveAspectRatio='none'
        />
      </defs>
    </svg>
  );
};
