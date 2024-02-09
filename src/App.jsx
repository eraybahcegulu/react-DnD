import { Button, Input, Form, Table, Spin, Tag } from 'antd';
import { dateNow } from './utils/moment'
import { id } from './utils/uuid'
import { status } from './utils/status'
import { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const todosJSON = localStorage.getItem('todos');
      const savedTodos = todosJSON ? JSON.parse(todosJSON) : [];
      setTodos(savedTodos);
      setLoading(false);
    }, 200);
  }, []);

  const onFinishAddTodo = async (values) => {
    const newTodo = {
      id: id(),
      createdAt: dateNow(),
      status: status.INPROGRESS,
      isCompleted: false,
      ...values
    };


    const updatedTodos = [...todos, newTodo];
    localStorage.setItem('todos', JSON.stringify(updatedTodos));

    setTodos(updatedTodos);
  };

  const setCompleted = async (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });

    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const setNotCompleted = async (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, isCompleted: false };
      }
      return todo;
    });
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const columns = [
    {
      render: (_, record) => (
        <div className='flex flex-row gap-2 w-8 items-center justify-center'>
          {
            record.isCompleted === false
              ?
              <FontAwesomeIcon className='cursor-pointer text-xl' icon={faSquare} onClick={() => setCompleted(record.id)} />
              :
              <>

                <FontAwesomeIcon className='cursor-pointer text-xl' icon={faSquareCheck} onClick={() => setNotCompleted(record.id)} />
              </>

          }

          {
            (record.status === status.INPROGRESS && record.isCompleted === false) &&
            <LoadingOutlined className='cursor-pointer text-xl' />
          }
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <div className='flex flex-row gap-2 w-20'>
          {
            record.isCompleted === true
              ?
              <Tag color="green"> Completed </Tag>
              :
              <>
                {
                  record.status === status.INPROGRESS
                  &&
                  <Tag color="orange"> {record.status} </Tag>
                }

                {
                  record.status === status.FOCUSED
                  &&
                  <Tag color="red"> {record.status} </Tag>
                }
              </>
          }
        </div>
      ),
    },
    {
      title: 'Todo',
      dataIndex: 'todo',
      key: 'todo',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  return (
    <div className='flex flex-col justify-center items-center'>
      <Form
        onFinish={onFinishAddTodo}
        className='flex flex-row gap-2 justify-center items-center mt-20'
      >
        <Form.Item
          name="todo"
          rules={[{ required: true, message: 'Required todo' },
          { max: 40, message: "Max. 40 characters." },
          ]}
        >
          <Input placeholder='To Do' style={{ width: 400 }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" >
            Add
          </Button>

        </Form.Item>
      </Form>

      {
        loading
          ?
          <Spin size="large" />
          :
          <Table rowKey="id" className="mt-4 max-w-[475px] md:max-w-[750px] xl:max-w-[1200px]" dataSource={todos} columns={columns} />
      }

    </div>
  );
};

export default App;
