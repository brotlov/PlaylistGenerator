import { Component, OnInit, Inject } from '@angular/core';
import { dialogObjectIndividual } from '../models/dialogObjectIndividual';

export class dialogObject {
    type: string;
    name: string;
    selected: true;
    image: string;
    items: dialogObjectIndividual[];
    year: string;
    open: boolean;
}