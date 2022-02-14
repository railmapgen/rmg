import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../redux';
import InterchangeCard from '../interchange/interchange-card';
import { addColineColor, removeColineColor, updateColineColor } from '../../../redux/param/coline-action';
import { InterchangeInfo } from '../../../constants/constants';

export default function ColineSection() {
    const dispatch = useDispatch();

    const selectedColine = useAppSelector(state => state.app.selectedColine);
    const { coline } = useAppSelector(state => state.param);

    // return empty when selectedColine is invalid
    if (selectedColine === undefined || selectedColine >= coline.length) return <></>;

    const handleAdd = () => (info: InterchangeInfo) => {
        dispatch(addColineColor(selectedColine, info));
    };

    const handleDelete = () => (i: number) => {
        dispatch(removeColineColor(selectedColine, i));
    };

    const handleUpdate = () => (i: number, info: InterchangeInfo) => {
        dispatch(updateColineColor(selectedColine, i, info));
    };

    // TODO: support multiple coline colors in one segment
    return (
        <InterchangeCard
            interchangeList={coline.at(selectedColine)!.colors}
            onAdd={undefined && handleAdd()}
            onDelete={undefined && handleDelete()}
            onUpdate={handleUpdate()}
        />
    );
}
