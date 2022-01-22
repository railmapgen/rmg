import React from 'react';
import { mount, shallow } from 'enzyme';
import InterchangeCard from './interchange-card';
import { InterchangeInfo, MonoColour } from '../../../../constants/constants';
import { CityCode } from '@railmapgen/rmg-palette-resources';
import { act } from 'react-dom/test-utils';
import { TestingProvider } from '../../../../setupTests';

const mockInterchangeInfo1: InterchangeInfo = [
    CityCode.Hongkong,
    'tcl',
    '#F38B00',
    MonoColour.white,
    '東涌綫',
    'Tung Chung Line',
];
const mockInterchangeInfo2: InterchangeInfo = [
    CityCode.Hongkong,
    'ael',
    '#007078',
    MonoColour.white,
    '機場快綫',
    'Airport Express',
];

const mockCallbacks = {
    onAdd: jest.fn(),
    onDelete: jest.fn(),
    onUpdate: jest.fn(),
};

describe('Unit tests for InterchangeCard component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Can render card with empty interchange list as expected', () => {
        const wrapper = mount(<InterchangeCard interchangeList={[]} {...mockCallbacks} />, {
            wrappingComponent: TestingProvider,
        });

        expect(wrapper.text()).toContain('No interchanges');

        wrapper.find('button').simulate('click');
        expect(mockCallbacks.onAdd).toBeCalledTimes(1);
        expect(mockCallbacks.onAdd).toBeCalledWith(['hongkong', '', '#aaaaaa', '#fff', '', '']); // empty interchange info
    });

    it('Can render card with 1 interchange info as expected', () => {
        const wrapper = mount(<InterchangeCard interchangeList={[mockInterchangeInfo1]} {...mockCallbacks} />, {
            wrappingComponent: TestingProvider,
        });

        const hStack = wrapper.find('div.chakra-stack');
        expect(hStack).toHaveLength(1);

        const iconBtns = hStack.find('IconButton');
        expect(iconBtns).toHaveLength(3); // colour edit button, copy button, delete button
        expect(iconBtns.at(0).props()).toMatchObject({ bg: '#F38B00', color: '#fff' }); // colour edit button has desired styles

        const inputEls = hStack.find('input');
        expect(inputEls).toHaveLength(2);
        expect(inputEls.at(0).getDOMNode<HTMLInputElement>().value).toBe('東涌綫');
        expect(inputEls.at(1).getDOMNode<HTMLInputElement>().value).toBe('Tung Chung Line');
    });

    it('Can handle open and close colour modal as expected', async () => {
        const wrapper = mount(<InterchangeCard interchangeList={[mockInterchangeInfo1]} {...mockCallbacks} />, {
            wrappingComponent: TestingProvider,
        });
        expect(document.querySelectorAll('.chakra-portal')).toHaveLength(0);

        await act(async () => {
            await wrapper.find('button').at(0).simulate('click');
        });
        expect(document.querySelectorAll('.chakra-portal')).toHaveLength(1);
    });

    xit('Can handle theme update from colour modal as expected', () => {
        // FIXME: investigate issue caused by combination of shallow, wrappingComponent, custom event
        const wrapper = shallow(<InterchangeCard interchangeList={[mockInterchangeInfo1]} {...mockCallbacks} />, {
            wrappingComponent: TestingProvider,
        });
        console.log(wrapper.debug());
        wrapper.find('ColourModal').simulate('update', ['hongkong', 'eal', '#61B4E4', '#fff']);

        expect(mockCallbacks.onUpdate).toBeCalledTimes(1);
        expect(mockCallbacks.onUpdate).toBeCalledWith(0, [
            'hongkong',
            'eal',
            '#61B4E4',
            '#fff',
            '東涌綫',
            'Tung Chung Line',
        ]);
    });

    it('Can duplicate and delete interchange info as expected', () => {
        const wrapper = mount(<InterchangeCard interchangeList={[mockInterchangeInfo1]} {...mockCallbacks} />, {
            wrappingComponent: TestingProvider,
        });

        // copy current interchange info
        wrapper.find('button').at(1).simulate('click');
        expect(mockCallbacks.onAdd).toBeCalledTimes(1);
        expect(mockCallbacks.onAdd).toBeCalledWith(mockInterchangeInfo1); // current info

        // delete current interchange info
        wrapper.find('button').at(2).simulate('click');
        expect(mockCallbacks.onDelete).toBeCalledTimes(1);
        expect(mockCallbacks.onDelete).toBeCalledWith(0); // current index
    });

    it('Can render card with multiple interchange info as expected', () => {
        const wrapper = mount(
            <InterchangeCard interchangeList={[mockInterchangeInfo1, mockInterchangeInfo2]} {...mockCallbacks} />,
            {
                wrappingComponent: TestingProvider,
            }
        );

        const hStacks = wrapper.find('HStack');
        expect(hStacks).toHaveLength(2);

        // only the first stack has labels
        expect(hStacks.at(0).find('label')).not.toHaveLength(0);
        expect(hStacks.at(1).find('label')).toHaveLength(0);

        // only the last stack has copy button
        expect(hStacks.at(0).find('MdContentCopy')).toHaveLength(0);
        expect(hStacks.at(1).find('MdContentCopy')).toHaveLength(1);

        // both stacks have delete button
        expect(hStacks.at(0).find('MdDelete')).toHaveLength(1);
        expect(hStacks.at(1).find('MdDelete')).toHaveLength(1);
    });
});
