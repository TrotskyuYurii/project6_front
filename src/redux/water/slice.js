import { createSlice } from '@reduxjs/toolkit';
import {
  fetchWaterPerDay,
  fetchWaterPerMonth,
  addWater,
  changeWater,
  deleteWater,
} from './operations';

const localDate = () => {
  const milliseconds = Date.now();
  const date = new Date(milliseconds);

  return date.toLocaleDateString();
};

function handleLoading(state) {
  state.loading = true;
  state.error = null;
}

function handleError(state, action) {
  state.waters.waterPerDay.waterRecord = [];
  state.error = action.payload;
  state.loading = false;
}

const waterSlice = createSlice({
  name: 'water',
  initialState: {
    waters: {
      waterPerMonth: [],
      waterPerDay: {
        // waterRate: 1.5,
        waterRecord: [],
      },
    },
    loading: false,
    error: false,
    activeDay: localDate(),
    currentDate: Date.now(),
  },
  reducers: {
    setActiveDay(state, action) {
      state.activeDay = action.payload;
    },
    setCurrentDate(state, action) {
      state.currentDate = action.payload;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(fetchWaterPerDay.pending, handleLoading)
      .addCase(fetchWaterPerDay.fulfilled, (state, action) => {
        state.error = false;
        state.loading = false;
        state.waters.waterPerDay.waterRecord = action.payload;
      })
      .addCase(fetchWaterPerDay.rejected, handleError)
      .addCase(fetchWaterPerMonth.pending, handleLoading)
      .addCase(fetchWaterPerMonth.fulfilled, (state, action) => {
        state.error = false;
        state.loading = false;
        state.waters.waterPerMonth = action.payload;
      })
      .addCase(fetchWaterPerMonth.rejected, handleError)
      .addCase(deleteWater.pending, handleLoading)
      .addCase(deleteWater.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;

        // код Андрія
        // const index = state.waters.waterPerDay.waterRecord.findIndex(
        //   water => water._id === action.payload._id
        // );
        // state.waters.waterPerDay.waterRecord.splice(index, 1);

        // if (state.waters.waterPerMonth[action.payload.date]) {
        //   const index = state.waters.waterPerMonth[action.payload.date].findIndex(
        //     water => water._id === action.payload._id
        //   );
        //   state.waters.waterPerMonth[action.payload.date].splice(index, 1);
        // }

        state.waters.waterPerDay.waterRecord = state.waters.waterPerDay.waterRecord.filter(
          entry => entry._id !== action.payload._id
        );
        state.waters.waterPerMonth = state.waters.waterPerMonth.filter(
          entry => entry._id !== action.payload._id
        );
      })
      .addCase(deleteWater.rejected, handleError)
      .addCase(addWater.pending, handleLoading)
      .addCase(addWater.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;

        //код Андрія
        // state.waters.waterPerDay.waterRecord.push(action.payload.waterRecord);

        // const date = new Date(state.currentDate);
        // const month =
        //   date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : String(date.getMonth() + 1);
        // if (state.waters.waterPerMonth[action.payload.waterRecord.localDate]) {
        //   state.waters.waterPerMonth[action.payload.waterRecord.localDate].push(
        //     action.payload.waterRecord
        //   );
        // } else if (action.payload.waterRecord.localDate.split('.')[1] === month) {
        //   state.waters.waterPerMonth[action.payload.waterRecord.localDate] = [
        //     action.payload.waterRecord,
        //   ];
        // }

        // я додав
        state.waters.waterPerDay.waterRecord.push(action.payload);
        state.waters.waterPerMonth.push(action.payload);

        // const date = new Date(state.currentDate);
        // const month =
        //   date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : String(date.getMonth() + 1);

        // if (state.waters.waterPerMonth[action.payload.date]) {
        //   state.waters.waterPerMonth[action.payload.date].push(action.payload);
        // } else if (action.payload.date.split('.')[1] === month) {
        //   state.waters.waterPerMonth[action.payload.date] = [action.payload];
        // }
        //
      })
      .addCase(addWater.rejected, handleError)
      .addCase(changeWater.pending, handleLoading)
      // .addCase(changeWater.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.error = false;
      //   const index = state.waters.waterPerDay.waterRecord.findIndex(
      //     water => water._id === action.payload.water._id
      //   );
      //   state.waters.waterPerDay.waterRecord[index] = action.payload.water;
      //   state.waters.waterPerDay.waterRecord[index] = action.payload.water;

      //   if (state.waters.waterPerMonth[action.payload.water.date]) {
      //     const index = state.waters.waterPerMonth[action.payload.water.date].findIndex(
      //       water => water._id === action.payload.water._id
      //     );
      //     state.waters.waterPerMonth[action.payload.water.date][index] = action.payload.water;
      //   }
      // })
      .addCase(changeWater.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        console.log(action.payload);
        const updatedEntry = action.payload;
        const index = state.waters.waterPerDay.waterRecord.findIndex(
          entry => entry._id === updatedEntry._id
        );

        if (index !== -1) {
          state.waters.waterPerDay.waterRecord[index] = updatedEntry;
        }

        const indexMonth = state.waters.waterPerMonth.findIndex(
          entry => entry._id === updatedEntry._id
        );

        if (indexMonth !== -1) {
          state.waters.waterPerMonth[indexMonth] = updatedEntry;
        }

        // const updatedWater = action.payload;
        // const { _id, date } = updatedWater;

        // const dailyIndex = state.waters.waterPerDay.waterRecord.findIndex(
        //   water => water._id === _id
        // );

        // if (dailyIndex !== -1) {
        //   state.waters.waterPerDay.waterRecord[dailyIndex] = updatedWater;
        // }

        // if (state.waters.waterPerMonth[date]) {
        //   const monthlyIndex = state.waters.waterPerMonth[date].findIndex(
        //     water => water._id === _id
        //   );
        //   if (monthlyIndex !== -1) {
        //     state.waters.waterPerMonth[date][monthlyIndex] = updatedWater;
        //   }
        // }
      })
      .addCase(changeWater.rejected, handleError),
});

export const waterReducer = waterSlice.reducer;
export const { setActiveDay, setCurrentDate } = waterSlice.actions;
